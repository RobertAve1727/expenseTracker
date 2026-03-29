import React, { useState } from "react";
import {
  X,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  ChevronDown,
} from "lucide-react";
import type { Transaction, Category } from "../types";
import { TransactionService } from "../services/transactionService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
  userId: string;
}

const AddTransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdd,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food" as Category,
    date: new Date().toISOString().split("T")[0],
    note: "",
    type: "expense",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const savedTx = await TransactionService.create(formData, userId);
      onAdd(savedTx);
      onClose();
      setFormData({
        amount: "",
        category: "Food" as Category,
        date: new Date().toISOString().split("T")[0],
        note: "",
        type: "expense",
      });
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Type Switcher */}
          <div className="flex bg-slate-100 dark:bg-[#0f1115] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl capitalize transition-all ${
                  formData.type === t
                    ? "bg-indigo-600 dark:bg-[#6366f1] text-white shadow-md"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest">
              Amount
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <DollarSign size={18} />
              </div>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Category,
                    })
                  }
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Income">Income</option>
                  <option value="Custom">Custom</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest">
                Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Note Textarea */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1 tracking-widest">
              Note
            </label>
            <textarea
              placeholder="Enter a description..."
              className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none h-28 resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 dark:bg-[#6366f1] hover:bg-indigo-700 dark:hover:bg-[#5558e3] text-white font-bold py-4 rounded-2xl mt-4 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Save Transaction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
