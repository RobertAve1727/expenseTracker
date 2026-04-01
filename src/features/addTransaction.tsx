import React, { useEffect, useState } from "react";
import { X, ChevronDown, Calendar, Hash, Notebook } from "lucide-react";
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
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    type: "expense",
  });

  // SYNC: Fetching custom segments directly from the categories table
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/categories?userId=${userId}`,
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const categoryNames = data.map((cat: any) => cat.name);
          setAvailableCategories(categoryNames);

          // Auto-select the first category if current selection is invalid or empty
          if (
            !formData.category ||
            !categoryNames.includes(formData.category)
          ) {
            setFormData((prev) => ({ ...prev, category: categoryNames[0] }));
          }
        } else {
          setAvailableCategories([]);
        }
      } catch (error) {
        console.error("Stream Sync Error:", error);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return;

    setLoading(true);
    try {
      const savedTx = await TransactionService.create(formData, userId);
      onAdd(savedTx);

      // Reset form state for next entry
      setFormData({
        amount: "",
        category: availableCategories[0] || "",
        date: new Date().toISOString().split("T")[0],
        note: "",
        type: "expense",
      });
      onClose();
    } catch (error) {
      console.error("Entry initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl py-4 px-5 text-[var(--text-h)] outline-none focus:border-flow-accent/50 font-bold transition-all backdrop-blur-md placeholder:opacity-20";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all text-left">
      <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-[var(--border)]/50">
          <h2 className="text-3xl font-black text-[var(--text-h)] tracking-tighter">
            New Record
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text)] opacity-50 hover:opacity-100 hover:bg-white/5 transition-all"
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Type Switcher */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-[var(--text)] opacity-50 tracking-[0.3em] px-1">
              Flow Direction
            </label>
            <div className="flex bg-black/20 p-1.5 rounded-2xl border border-[var(--border)]">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    formData.type === t
                      ? "bg-flow-accent text-white shadow-lg shadow-flow-accent/20"
                      : "text-[var(--text)] opacity-50 hover:opacity-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-[var(--text)] opacity-50 tracking-[0.3em] px-1">
              Value
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-flow-accent z-10">
                <span className="font-black text-lg">₱</span>
              </div>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`${inputClasses} pl-12 text-2xl tracking-tight`}
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          {/* Segment Dropdown - Purely Dynamic */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-[var(--text)] opacity-50 tracking-[0.3em] px-1">
              Active Segment
            </label>
            <div className="relative">
              <select
                required
                className={`${inputClasses} appearance-none cursor-pointer uppercase text-[10px] tracking-widest text-[var(--text-h)] pr-12`}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {availableCategories.length > 0 ? (
                  availableCategories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-[#1a1a1a] text-white"
                    >
                      {cat.toUpperCase()}
                    </option>
                  ))
                ) : (
                  <option disabled value="">
                    NO BUCKETS INITIALIZED
                  </option>
                )}
              </select>
              <ChevronDown
                className="absolute right-5 top-1/2 -translate-y-1/2 text-flow-accent pointer-events-none"
                size={20}
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Timestamp & Notes */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-[var(--text)] opacity-50 tracking-[0.3em] px-1">
                Timestamp
              </label>
              <input
                type="date"
                className={`${inputClasses} [color-scheme:dark] text-xs`}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-[var(--text)] opacity-50 tracking-[0.3em] px-1">
                Note
              </label>
              <textarea
                placeholder="Entry description..."
                className={`${inputClasses} h-24 resize-none font-medium text-sm`}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading || availableCategories.length === 0}
            type="submit"
            className="w-full bg-flow-accent text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-flow-accent/20 disabled:opacity-30 uppercase text-[10px] tracking-[0.25em]"
          >
            {loading ? "Initializing..." : "Create Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
