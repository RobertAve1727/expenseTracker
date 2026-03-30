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
} from "lucide-react";
import type { Transaction } from "../types";
import { TransactionService } from "../services/transactionService";
import AddTransactionModal from "../features/addTransaction";
import DeleteConfirmModal from "../features/deleteTransaction";

const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    "Food",
    "Transport",
    "Bills",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser?.id;

  const loadData = async () => {
    if (!currentUserId) return;
    try {
      const [txData, budgetRes] = await Promise.all([
        TransactionService.getAllByUserId(currentUserId),
        fetch(`http://localhost:5000/budgets?userId=${currentUserId}`),
      ]);

      setTransactions(txData || []);

      const budgets = await budgetRes.json();
      if (budgets.length > 0) {
        setAvailableCategories(Object.keys(budgets[0].categoryLimits));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
    } else {
      loadData();
    }
  }, [currentUserId, navigate]);

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
    switch (category) {
      case "Food":
        return <Utensils size={iconSize} />;
      case "Transport":
        return <Car size={iconSize} />;
      case "Bills":
        return <Lightbulb size={iconSize} />;
      default:
        return <Tag size={iconSize} />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numericValue =
      Math.abs(parseFloat(amount.toString().replace(/[^\d.-]/g, ""))) || 0;
    return numericValue.toLocaleString();
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Ledger
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-indigo-500" />{" "}
              {currentUser?.name}'s Stream
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-[#6366f1] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus size={20} strokeWidth={3} /> New Entry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-2 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
            <input
              placeholder="Search descriptions..."
              className="w-full pl-14 pr-4 py-4 bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-[24px] outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="w-full px-6 py-4 bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-[24px] outline-none appearance-none font-bold text-indigo-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter
              size={16}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800/50 rounded-[3rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-10 py-8">Label</th>
                <th className="px-10 py-8">Segment</th>
                <th className="px-10 py-8">Timestamp</th>
                <th className="px-10 py-8">Value</th>
                <th className="px-10 py-8 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/20">
              {filteredTransactions.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${item.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
                      >
                        {item.type === "income" ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black dark:text-white">
                          {item.note || "General"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10 w-fit">
                      {getIcon(item.category)} {item.category}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-500 font-bold">
                    {item.date}
                  </td>
                  <td
                    className={`px-10 py-6 font-black text-sm ${item.type === "income" ? "text-emerald-500" : "dark:text-white"}`}
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
                      className="p-3 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadData();
        }}
        onAdd={(tx) => setTransactions([tx, ...transactions])}
        userId={currentUserId}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!txToDelete) return;
          await TransactionService.delete(txToDelete);
          setTransactions(transactions.filter((t) => t.id !== txToDelete));
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default TransactionPage;
