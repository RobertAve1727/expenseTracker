import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Utensils,
  Car,
  Lightbulb,
  Clock,
  Tag,
  ShoppingBag,
  Zap,
  Briefcase,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";
import type { Transaction } from "../services";
import { TransactionService } from "../services/transactionService";
import AddTransactionModal from "../features/addTransaction";
import DeleteConfirmModal from "../features/deleteTransaction";

const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");

  // Get current session from Supabase
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setCurrentUserId(session.user.id);
        // Try to get name from user_metadata or profiles table
        setUserName(session.user.user_metadata?.fullName || "User");
      }
    };
    getSession();
  }, [navigate]);

  const loadData = async () => {
    if (!currentUserId) return;
    try {
      // Fetch transactions via service and categories via supabase client
      const [txData, { data: catData }] = await Promise.all([
        TransactionService.getAllByUserId(currentUserId),
        supabase.from("categories").select("name").eq("user_id", currentUserId),
      ]);

      setTransactions(txData || []);

      if (catData && Array.isArray(catData)) {
        setAvailableCategories(catData.map((cat: any) => cat.name));
      }
    } catch (err) {
      console.error("Ledger sync error:", err);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadData();
    }
  }, [currentUserId]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = (t.note || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (category: string) => {
    const iconSize = 14;
    const label = category.toUpperCase();

    if (label.includes("FOOD") || label.includes("EAT"))
      return <Utensils size={iconSize} />;
    if (
      label.includes("TRANS") ||
      label.includes("CAR") ||
      label.includes("RIDE")
    )
      return <Car size={iconSize} />;
    if (
      label.includes("BILL") ||
      label.includes("POWER") ||
      label.includes("UTIL")
    )
      return <Lightbulb size={iconSize} />;
    if (label.includes("SHOP") || label.includes("BUY"))
      return <ShoppingBag size={iconSize} />;
    if (
      label.includes("WORK") ||
      label.includes("JOB") ||
      label.includes("SALARY")
    )
      return <Briefcase size={iconSize} />;
    if (label.includes("URGENT") || label.includes("ZAP"))
      return <Zap size={iconSize} />;

    return <Tag size={iconSize} />;
  };

  const formatCurrency = (amount: string | number) => {
    const numericValue =
      Math.abs(parseFloat(amount.toString().replace(/[^\d.-]/g, ""))) || 0;
    return numericValue.toLocaleString();
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-h)] tracking-tighter">
              Transaction
            </h1>
            <p className="text-[var(--text)] text-xs mt-2 font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-70">
              <Clock size={14} className="text-flow-accent" /> {userName}'s
              Financial Stream
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-flow-accent text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-flow-accent/20 active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            <Plus size={18} strokeWidth={3} /> New Entry
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-2 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-40 group-focus-within:text-flow-accent group-focus-within:opacity-100 transition-all w-5 h-5" />
            <input
              placeholder="Search transaction..."
              className="w-full pl-14 pr-4 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-[20px] outline-none focus:border-flow-accent/50 text-[var(--text-h)] font-bold text-sm backdrop-blur-md transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative group">
            <select
              className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-[20px] outline-none appearance-none font-black text-xs uppercase tracking-widest text-flow-accent backdrop-blur-md cursor-pointer focus:border-flow-accent/50"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
            <Filter
              size={16}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-40 pointer-events-none"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text)] text-[10px] uppercase font-black tracking-[0.3em] opacity-50">
                  <th className="px-10 py-8">Label</th>
                  <th className="px-10 py-8">Category</th>
                  <th className="px-10 py-8">Timestamp</th>
                  <th className="px-10 py-8">Value</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {filteredTransactions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/5 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            item.type === "income"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {item.type === "income" ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[var(--text-h)]">
                            {item.note || "General"}
                          </p>
                          <p className="text-[10px] text-[var(--text)] font-black uppercase tracking-tighter opacity-50">
                            {item.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase text-flow-accent bg-flow-accent/5 px-4 py-2 rounded-lg border border-flow-accent/10 w-fit">
                        {getIcon(item.category)} {item.category}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[11px] text-[var(--text)] font-bold opacity-70">
                      {item.date}
                    </td>
                    <td
                      className={`px-10 py-6 font-black text-sm tracking-tight ${
                        item.type === "income"
                          ? "text-emerald-500"
                          : "text-[var(--text-h)]"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}₱{" "}
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => {
                          setTxToDelete(item.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-3 text-[var(--text)] hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text)] opacity-30">
                No data points found in this segment
              </p>
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadData();
        }}
        onAdd={(tx) => setTransactions([tx, ...transactions])}
        userId={currentUserId || ""}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!txToDelete) return;
          try {
            await TransactionService.delete(txToDelete);
            setTransactions(transactions.filter((t) => t.id !== txToDelete));
            setIsDeleteModalOpen(false);
          } catch (error) {
            console.error("Delete operation failed", error);
          }
        }}
      />
    </div>
  );
};

export default TransactionPage;
