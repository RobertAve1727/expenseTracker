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
    name: "SHOPPING",
    icon: "ShoppingBag",
    color: "bg-flow-accent",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      await fetch(`http://localhost:5000/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });
      await onCategoryCreated();
      onClose();
    } catch (error) {
      console.error(error);
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

  // MATCHED: High-contrast white background for inputs as seen in image_b7f38c.png
  const inputClasses =
    "w-full bg-white border border-slate-200 rounded-[1.5rem] py-6 px-6 text-black outline-none focus:border-flow-accent/50 font-black transition-all shadow-sm uppercase tracking-widest text-sm";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all">
      {/* MODAL BODY: Lighter grey glassmorphism matching your screenshot */}
      <div className="bg-[#b3b3b3]/90 border border-white/20 w-full max-w-md rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-10 pb-6">
          <h2 className="text-3xl font-black text-[#1a1a1a] tracking-tighter">
            New Bucket
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-black transition-all"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-10">
          {/* Identity Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">
                Identity
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-[10px] font-black text-[#00d1c1] hover:brightness-90 uppercase tracking-widest"
              >
                {isCustomCategory ? "Use List" : "Create Unique"}
              </button>
            </div>

            {isCustomCategory ? (
              <input
                autoFocus
                required
                placeholder="Ex: Gaming..."
                className={inputClasses}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <div className="relative">
                <select
                  className={`${inputClasses} appearance-none cursor-pointer`}
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
                      {n.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Visual Marker (Icons) */}
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] px-2">
              Visual Marker
            </label>
            <div className="grid grid-cols-5 gap-3">
              {icons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.name })}
                  className={`aspect-square rounded-[1.2rem] flex items-center justify-center border-2 transition-all duration-300 ${
                    formData.icon === item.name
                      ? "bg-[#00d1c1]/10 border-[#00d1c1] text-[#00d1c1]"
                      : "bg-white/50 border-white/40 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    size: 24,
                    strokeWidth: 2.5,
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#00d1c1] hover:brightness-105 text-white font-black py-6 rounded-[1.5rem] transition-all active:scale-[0.98] shadow-xl shadow-[#00d1c1]/20 disabled:opacity-30 uppercase text-sm tracking-[0.15em]"
          >
            {loading ? "Initializing..." : "Initialize Segment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
