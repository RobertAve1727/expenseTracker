import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import AddCategoryModal from "../features/newCategory";
import type { Category } from "../types";

const Categories = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "L4QIW7RbHQM";
    try {
      const [catRes, transRes, budgetRes] = await Promise.all([
        fetch(`http://localhost:5000/categories?userId=${userId}`),
        fetch(`http://localhost:5000/transactions?userId=${userId}`),
        fetch(`http://localhost:5000/budgets?userId=${userId}`),
      ]);

      setCategories(await catRes.json());
      setTransactions(await transRes.json());
      const bData = await budgetRes.json();
      setBudgetData(bData[0]);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!window.confirm(`Permanently delete "${cat.name}" bucket?`)) return;

    try {
      await fetch(`http://localhost:5000/categories/${cat.id}`, {
        method: "DELETE",
      });

      if (budgetData) {
        const updatedLimits = { ...budgetData.categoryLimits };
        delete updatedLimits[cat.name];
        await fetch(`http://localhost:5000/budgets/${budgetData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryLimits: updatedLimits }),
        });
      }
      setActiveMenu(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name] || Tag;
    return <Icon size={20} />;
  };

  if (loading)
    return (
      <div className="p-10 text-center dark:text-white font-black uppercase tracking-widest">
        Syncing Buckets...
      </div>
    );

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Categories
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
              Manage Spending Buckets
            </p>
          </div>
          <div className="flex gap-2 bg-white dark:bg-[#1a1d23] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded-xl ${viewType === "grid" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded-xl ${viewType === "list" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
            >
              <List size={20} />
            </button>
          </div>
        </header>

        <div className="relative mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 w-5 h-5" />
          <input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-[2rem] outline-none font-bold dark:text-white"
          />
        </div>

        <div
          className={`grid gap-6 ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          {filtered.map((cat) => {
            const limit = budgetData?.categoryLimits[cat.name] || 0;
            const spent = transactions
              .filter((t) => t.category === cat.name && t.type === "expense")
              .reduce(
                (sum, t) =>
                  sum +
                  parseFloat(
                    t.amount.toString().replace(/[^\d.-]/g, "") || "0",
                  ),
                0,
              );

            const percent =
              limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            const isNearLimit = percent > 85;

            return (
              <div
                key={cat.id}
                className="relative bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`p-4 rounded-2xl ${cat.color} bg-opacity-10 ${cat.color.replace("bg-", "text-")} transition-transform group-hover:scale-110`}
                  >
                    {getIcon(cat.icon)}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === cat.id ? null : cat.id)
                      }
                      className="text-slate-300 hover:text-white"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {activeMenu === cat.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#252a33] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                  {cat.name}
                </h3>

                <div className="flex justify-between items-end mb-4 text-sm font-bold">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Monthly Budget
                  </span>
                  <span className="dark:text-slate-300 text-xs">
                    ₱{spent.toLocaleString()}{" "}
                    <span className="text-slate-500">
                      / ₱{limit.toLocaleString()}
                    </span>
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-1000 ${isNearLimit ? "bg-rose-500" : "bg-indigo-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${isNearLimit ? "text-rose-500 animate-pulse" : "text-slate-400"}`}
                >
                  {isNearLimit
                    ? "⚠️ Near Limit"
                    : `${Math.round(percent)}% used`}
                </p>
              </div>
            );
          })}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 transition-all min-h-[250px] group"
          >
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 group-hover:bg-indigo-500/10">
              <Plus size={32} />
            </div>
            <span className="font-black uppercase text-xs tracking-widest">
              Create New
            </span>
          </button>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={fetchData}
      />
    </div>
  );
};

export default Categories;
