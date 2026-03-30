import React, { useState } from "react";
import {
  X,
  DollarSign,
  Target,
  Palette,
  Briefcase,
  ShoppingBag,
  Zap,
  Car,
  Utensils,
  Plus,
  Type,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    name: "Shopping",
    budget: "",
    icon: "ShoppingBag",
    color: "bg-indigo-500",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Dummy delay for visual feedback
      setLoading(false);
      onClose();
      setFormData({
        name: "Shopping",
        budget: "",
        icon: "ShoppingBag",
        color: "bg-indigo-500",
      });
    }, 1500);
  };

  const icons = [
    { name: "ShoppingBag", icon: <ShoppingBag /> },
    { name: "Briefcase", icon: <Briefcase /> },
    { name: "Utensils", icon: <Utensils /> },
    { name: "Car", icon: <Car /> },
    { name: "Zap", icon: <Zap /> },
  ];

  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-amber-500",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            New Segment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transición-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-6">
          {/* Category Input Section (Toggled) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Identify Segment
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1 hover:opacity-70"
              >
                {isCustomCategory ? "Predefined List" : "Create Unique"}
              </button>
            </div>

            {isCustomCategory ? (
              <div className="relative animate-in slide-in-from-top-2 duration-200">
                <Type
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"
                />
                <input
                  autoFocus
                  required
                  placeholder="Enter unique name..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-indigo-500/30 dark:border-indigo-500/20 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            ) : (
              <select
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none appearance-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              >
                {[
                  "Food",
                  "Transport",
                  "Bills",
                  "Income",
                  "Shopping",
                  "Entertainment",
                ].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Budget Input (Pure Typing, No arrows) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Initial Balance Goal (Budget)
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
              />
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-lg"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
              />
            </div>
          </div>

          {/* Icon Selector (Simplified Grid) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Visual Marker (Icon)
            </label>
            <div className="grid grid-cols-5 gap-3 pt-2">
              {icons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.name })}
                  className={`p-4 rounded-xl flex items-center justify-center border-2 transition-all ${
                    formData.icon === item.name
                      ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {React.cloneElement(item.icon, { size: 20 })}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Distinct Tone (Color)
            </label>
            <div className="flex gap-3 pt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    formData.color === color
                      ? "border-indigo-600 dark:border-indigo-400 scale-110 shadow-lg shadow-indigo-500/30"
                      : "border-transparent"
                  } ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 dark:bg-[#6366f1] text-white font-black py-4 rounded-2xl mt-4 transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Initialize Segment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
