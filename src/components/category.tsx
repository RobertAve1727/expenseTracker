import React, { useState } from "react";
import {
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  ShoppingBag,
  Car,
  Zap,
  Utensils,
  Plus,
} from "lucide-react";
import AddCategoryModal from "../features/newCategory"; // [!code ++] New Import

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  budget: number;
  spent: number;
  color: string;
}

const Categories = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false); // [!code ++] Modal state

  // Initial categories
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Food",
      icon: <Utensils size={20} />,
      budget: 5000,
      spent: 3200,
      color: "bg-orange-500",
    },
    {
      id: "2",
      name: "Transport",
      icon: <Car size={20} />,
      budget: 2000,
      spent: 1850,
      color: "bg-blue-500",
    },
    {
      id: "3",
      name: "Bills",
      icon: <Zap size={20} />,
      budget: 8000,
      spent: 7500,
      color: "bg-yellow-500",
    },
    {
      id: "4",
      name: "Shopping",
      icon: <ShoppingBag size={20} />,
      budget: 3000,
      spent: 1200,
      color: "bg-pink-500",
    },
  ]);

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] transition-colors duration-500 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Section (Simplified) */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Categories
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
              Manage your spending buckets
            </p>
          </div>
          {/* redundant button removed */}
        </header>

        {/* ... (Filters & View Toggle remain the same) ... */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div className="flex bg-white dark:bg-[#1a1d23] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded-xl transition-all ${viewType === "grid" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded-xl transition-all ${viewType === "list" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div
          className={`grid gap-6 ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          {categories.map((cat) => {
            const percent = Math.min((cat.spent / cat.budget) * 100, 100);
            const isNearLimit = percent > 85;

            return (
              <div
                key={cat.id}
                className="group bg-white dark:bg-[#1a1d23] p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl ${cat.color} bg-opacity-10 ${cat.color.replace("bg-", "text-")} group-hover:scale-110 transition-transform`}
                  >
                    {cat.icon}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                  {cat.name}
                </h3>
                <div className="flex justify-between items-end mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Monthly Budget
                  </p>
                  <p className="text-sm font-black dark:text-slate-300">
                    ₱{cat.spent.toLocaleString()}{" "}
                    <span className="text-slate-500 font-medium">
                      / ₱{cat.budget.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${isNearLimit ? "bg-rose-500" : "bg-indigo-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p
                  className={`text-[10px] font-black uppercase tracking-tighter ${isNearLimit ? "text-rose-500" : "text-slate-400"}`}
                >
                  {isNearLimit
                    ? "⚠️ Near budget limit"
                    : `${Math.round(percent)}% used`}
                </p>
              </div>
            );
          })}

          {/* Create New Card (Now Triggers Modal) */}
          <button
            onClick={() => setIsModalOpen(true)} // [!code ++] Open modal
            className="flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all group min-h-[220px]"
          >
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50 mb-3 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="font-black uppercase text-[10px] tracking-widest">
              Create New
            </span>
          </button>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // [!code ++] Modal component
      />
    </div>
  );
};

export default Categories;
