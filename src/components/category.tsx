import React, { useEffect, useState } from "react";
import { MoreVertical, Search, LayoutGrid, List, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react"; // Import all for dynamic rendering
import AddCategoryModal from "../features/newCategory";

// Match your db.json structure
interface Transaction {
  userId: string;
  category: string;
  amount: string;
  type: string;
}

interface BudgetData {
  userId: string;
  categoryLimits: Record<string, number>;
}

const Categories = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for DB data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from db.json
  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "L4QIW7RbHQM"; // Fallback to your ID

    try {
      const [transRes, budgetRes] = await Promise.all([
        fetch(`http://localhost:5000/transactions?userId=${userId}`),
        fetch(`http://localhost:5000/budgets?userId=${userId}`),
      ]);

      const transData = await transRes.json();
      const bData = await budgetRes.json();

      setTransactions(transData);
      setBudgetData(bData[0]); // Assuming one budget object per user
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Helper to get Icon component dynamically
  const getIcon = (iconName: string) => {
    const IconComponent =
      (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent size={20} />;
  };

  // 3. Define visual metadata (since db.json only has names/limits)
  const categoryMetadata: Record<string, { color: string; icon: string }> = {
    Food: { color: "bg-orange-500", icon: "Utensils" },
    Transport: { color: "bg-blue-500", icon: "Car" },
    Bills: { color: "bg-yellow-500", icon: "Zap" },
    Entertainment: { color: "bg-purple-500", icon: "Play" },
    Shopping: { color: "bg-pink-500", icon: "ShoppingBag" },
    Income: { color: "bg-emerald-500", icon: "Briefcase" },
  };

  if (loading)
    return (
      <div className="p-10 text-center dark:text-white">Loading buckets...</div>
    );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Categories
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Manage your spending buckets
          </p>
        </header>

        {/* ... (Search and View Toggle remains same) ... */}

        <div
          className={`grid gap-6 ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          {budgetData &&
            Object.entries(budgetData.categoryLimits).map(([name, limit]) => {
              // Calculate spent for THIS category
              const spent = transactions
                .filter((t) => t.category === name && t.type === "expense")
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

              const meta = categoryMetadata[name] || {
                color: "bg-slate-500",
                icon: "Tag",
              };
              const percent = Math.min((spent / limit) * 100, 100);
              const isNearLimit = percent > 85;

              return (
                <div
                  key={name}
                  className="group bg-white dark:bg-[#1a1d23] p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`p-4 rounded-2xl ${meta.color} bg-opacity-10 ${meta.color.replace("bg-", "text-")} transition-transform`}
                    >
                      {getIcon(meta.icon)}
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                    {name}
                  </h3>
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Spent vs Budget
                    </p>
                    <p className="text-sm font-black dark:text-slate-300">
                      ₱{spent.toLocaleString()}{" "}
                      <span className="text-slate-500 font-medium">
                        / ₱{limit.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-1000 ${isNearLimit ? "bg-rose-500" : "bg-indigo-500"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p
                    className={`text-[10px] font-black uppercase ${isNearLimit ? "text-rose-500" : "text-slate-400"}`}
                  >
                    {isNearLimit
                      ? "⚠️ Near budget limit"
                      : `${Math.round(percent)}% used`}
                  </p>
                </div>
              );
            })}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 transition-all min-h-[220px]"
          >
            <Plus size={24} className="mb-2" />
            <span className="font-black uppercase text-[10px] tracking-widest">
              Create New
            </span>
          </button>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchData(); // Refresh data after closing modal
        }}
      />
    </div>
  );
};

export default Categories;
