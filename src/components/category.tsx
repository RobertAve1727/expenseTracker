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
  const [transactions, setTransactions] = useState([]);
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
    if (!window.confirm(`Delete "${cat.name}"?`)) return;

    try {
      // 1. Remove from categories
      await fetch(`http://localhost:5000/categories/${cat.id}`, {
        method: "DELETE",
      });

      // 2. Remove from budget limits
      if (budgetData) {
        const updatedLimits = { ...budgetData.categoryLimits };
        delete updatedLimits[cat.name];
        await fetch(`http://localhost:5000/budgets/${budgetData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryLimits: updatedLimits }),
        });
      }
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
        Loading...
      </div>
    );

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Categories
          </h1>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filtered.map((cat) => {
            const limit = budgetData?.categoryLimits[cat.name] || 0;
            // ... calculate spent logic from previous version ...
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 relative group"
              >
                <div className="flex justify-between mb-8">
                  <div
                    className={`p-4 rounded-2xl ${cat.color} bg-opacity-10 text-indigo-500`}
                  >
                    {getIcon(cat.icon)}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-2xl font-black dark:text-white">
                  {cat.name}
                </h3>
                <p className="text-slate-500 font-bold text-xs uppercase mt-2">
                  Limit: ₱{limit.toLocaleString()}
                </p>
              </div>
            );
          })}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500"
          >
            <Plus size={32} />
            <span className="font-black uppercase text-xs tracking-widest mt-4">
              New Category
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
