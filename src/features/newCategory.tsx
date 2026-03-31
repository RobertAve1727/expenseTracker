import React, { useState } from "react";
import { X, Briefcase, ShoppingBag, Zap, Car, Utensils } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: () => Promise<void> | void;
}

const AddCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCategoryCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "Shopping",
    icon: "ShoppingBag",
    color: "bg-indigo-500",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "L4QIW7RbHQM";

    try {
      // 1. Create the Category Definition
      await fetch(`http://localhost:5000/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });

      // 2. Sync with Budget (Upsert logic)
      const budgetRes = await fetch(
        `http://localhost:5000/budgets?userId=${userId}`,
      );
      const budgets = await budgetRes.json();

      if (budgets.length > 0) {
        const myBudget = budgets[0];
        await fetch(`http://localhost:5000/budgets/${myBudget.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryLimits: { ...myBudget.categoryLimits, [formData.name]: 0 },
          }),
        });
      } else {
        await fetch(`http://localhost:5000/budgets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            masterBudget: 0,
            categoryLimits: { [formData.name]: 0 },
          }),
        });
      }

      await onCategoryCreated();
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setLoading(false);
    }
  };

  const icons = [
    { name: "ShoppingBag", icon: <ShoppingBag /> },
    { name: "Briefcase", icon: <Briefcase /> },
    { name: "Utensils", icon: <Utensils /> },
    { name: "Car", icon: <Car /> },
    { name: "Zap", icon: <Zap /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            New Segment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-6">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Identify
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-[10px] font-black text-indigo-500 uppercase"
              >
                {isCustomCategory ? "List" : "Unique"}
              </button>
            </div>
            {isCustomCategory ? (
              <input
                autoFocus
                required
                placeholder="Name..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-indigo-500/30 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <select
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-4 text-slate-900 dark:text-white outline-none appearance-none font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              >
                {[
                  "Food",
                  "Transport",
                  "Bills",
                  "Shopping",
                  "Entertainment",
                ].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Visual Marker
            </label>
            <div className="grid grid-cols-5 gap-3 pt-2">
              {icons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.name })}
                  className={`p-4 rounded-xl flex items-center justify-center border-2 transition-all ${formData.icon === item.name ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 shadow-md" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}`}
                >
                  {React.cloneElement(item.icon, { size: 20 })}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 disabled:opacity-50 transition-transform active:scale-95"
          >
            {loading ? "Syncing..." : "Initialize Segment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
