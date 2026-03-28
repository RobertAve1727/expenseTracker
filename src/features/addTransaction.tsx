import React, { useState } from "react";
import { X, DollarSign, Calendar, Tag, FileText } from "lucide-react";
import type { Transaction, Category } from "../types";
import { TransactionService } from "../services/transactionService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: Transaction) => void;
}

const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
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
      const savedTx = await TransactionService.create(formData);
      onAdd(savedTx);
      onClose();
      // Reset form
      setFormData({
        amount: "",
        category: "Food" as Category,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1d23] border border-slate-800 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-[#0f1115] p-1 rounded-xl border border-slate-800">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                  formData.type === t
                    ? "bg-[#6366f1] text-white shadow-lg"
                    : "text-slate-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                required
                type="number"
                placeholder="0.00"
                className="w-full bg-[#0f1115] border border-slate-800 rounded-xl py-3 pl-10 text-white outline-none focus:ring-2 focus:ring-[#6366f1]"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
                Category
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <select
                  className="w-full bg-[#0f1115] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none appearance-none"
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
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
                Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="date"
                  className="w-full bg-[#0f1115] border border-slate-800 rounded-xl py-3 pl-10 text-white outline-none"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
              Note
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-3 text-slate-500"
                size={16}
              />
              <textarea
                placeholder="Description..."
                className="w-full bg-[#0f1115] border border-slate-800 rounded-xl py-3 pl-10 text-white outline-none resize-none"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#6366f1] hover:bg-[#5558e3] text-white font-bold py-4 rounded-xl mt-4 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
