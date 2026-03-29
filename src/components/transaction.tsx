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
  ShoppingBag,
  Clock,
} from "lucide-react";
import type { Transaction } from "../types/index";
import { TransactionService } from "../services/transactionService";
import AddTransactionModal from "../features/addTransaction";
import DeleteConfirmModal from "../features/deleteTransaction"; // New Import

const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // --- DELETE STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);

  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    const loadData = async () => {
      try {
        const data = await TransactionService.getAllByUserId(currentUserId);
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [currentUserId, navigate]);

  const openDeleteConfirm = (id: string) => {
    setTxToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!txToDelete) return;
    try {
      await TransactionService.delete(txToDelete);
      setTransactions(transactions.filter((t) => t.id !== txToDelete));
      setIsDeleteModalOpen(false);
      setTxToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = (t.note || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "Food":
        return <Utensils size={14} />;
      case "Transport":
        return <Car size={14} />;
      case "Bills":
        return <Lightbulb size={14} />;
      default:
        return <ShoppingBag size={14} />;
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#0f1115] min-h-screen font-['Rubik'] text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Transactions
          </h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Clock size={14} /> Showing history for:{" "}
            <span className="text-[#6366f1] font-medium">
              {currentUser?.name}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#1a1d23] border border-slate-800 rounded-2xl text-white outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full px-6 py-3.5 bg-[#1a1d23] border border-slate-800 rounded-2xl text-white outline-none"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Income">Income</option>
        </select>
      </div>

      <div className="bg-[#1a1d23] border border-slate-800/50 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/50 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6 font-bold">Details</th>
                <th className="px-8 py-6 font-bold">Category</th>
                <th className="px-8 py-6 font-bold">Date</th>
                <th className="px-8 py-6 font-bold">Amount</th>
                <th className="px-8 py-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredTransactions.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/10 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${item.type === "Income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
                      >
                        {item.type === "Income" ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#6366f1] transition-colors">
                          {item.note || "No note"}
                        </p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-700/50 uppercase">
                      {getIcon(item.category)} {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">
                    {item.date}
                  </td>
                  <td
                    className={`px-8 py-5 font-black text-sm ${item.type === "Income" ? "text-emerald-400" : "text-white"}`}
                  >
                    {item.amount}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => openDeleteConfirm(item.id)}
                      className="p-2.5 text-slate-700 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
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

      {/* --- MODALS --- */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(tx) => setTransactions([tx, ...transactions])}
        userId={currentUserId}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </div>
  );
};

export default TransactionPage;
