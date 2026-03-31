import React, { useEffect, useState } from "react";
import { X, DollarSign, ChevronDown } from "lucide-react";
import type { Transaction } from "../services";
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
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "", // Initialized as empty to be set once categories load
    date: new Date().toISOString().split("T")[0],
    note: "",
    type: "expense",
  });

  // Fetch your dynamic categories from the budget database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/budgets?userId=${userId}`,
        );
        const data = await res.json();
        if (data[0] && data[0].categoryLimits) {
          const categories = Object.keys(data[0].categoryLimits);
          setAvailableCategories(categories);
          // Set default selection to the first available category
          if (categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: categories[0] }));
          }
        }
      } catch (error) {
        console.error("Failed to sync categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const savedTx = await TransactionService.create(formData, userId);
      onAdd(savedTx);
      onClose();
      // Reset State
      setFormData({
        amount: "",
        category: availableCategories[0] || "",
        date: new Date().toISOString().split("T")[0],
        note: "",
        type: "expense",
      });
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            New Record
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
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
                    : "text-slate-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <DollarSign size={18} />
              </div>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-lg"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          {/* Dynamic Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Category
            </label>
            <div className="relative">
              <select
                required
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none appearance-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {availableCategories.length > 0 ? (
                  availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  <option disabled value="">
                    No categories found
                  </option>
                )}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Note
              </label>
              <textarea
                placeholder="Optional description..."
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none h-20 resize-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading || availableCategories.length === 0}
            type="submit"
            className="w-full bg-indigo-600 dark:bg-[#6366f1] text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
