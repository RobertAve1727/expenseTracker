import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  Plus,
  Tag,
  Trash2,
  HelpCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import AddCategoryModal from "../features/newCategory";
import DeleteCategoryModal from "../features/deleteCategory";
import type { Category } from "../services";

const Categories = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;
    if (!userId) return;

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

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const linkedTransactions = transactions.filter(
        (t) => t.category === categoryToDelete.name,
      );

      if (linkedTransactions.length > 0) {
        await Promise.all(
          linkedTransactions.map((t) =>
            fetch(`http://localhost:5000/transactions/${t.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ category: "Uncategorized" }),
            }),
          ),
        );
      }

      if (budgetData) {
        const updatedLimits = { ...budgetData.categoryLimits };
        delete updatedLimits[categoryToDelete.name];
        await fetch(`http://localhost:5000/budgets/${budgetData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryLimits: updatedLimits }),
        });
      }

      await fetch(`http://localhost:5000/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setActiveMenu(null);
      await fetchData();
    } catch (e) {
      console.error("Deletion failed:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FIXED ICON RESOLUTION HELPER
  const getIcon = (name: string) => {
    if (name === "Uncategorized")
      return <HelpCircle size={24} strokeWidth={2.5} />;
    const Icon = (LucideIcons as any)[name] || Tag;
    return <Icon size={24} strokeWidth={2.5} />;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--text-h)] font-black uppercase tracking-[0.3em] animate-pulse">
        Syncing Buckets...
      </div>
    );

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-12 bg-[var(--bg)] min-h-screen transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black text-[var(--text-h)] tracking-tighter">
              Categories
            </h1>
            <p className="text-[var(--text)] text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-50">
              Manage Spending Segments
            </p>
          </div>

          <div className="flex gap-2 bg-[var(--surface)] p-1.5 rounded-2xl border border-[var(--border)] shadow-xl backdrop-blur-md">
            {(["grid", "list"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewType === type
                    ? "bg-flow-accent text-[#1a1a1a] shadow-lg shadow-flow-accent/20"
                    : "text-[var(--text)] opacity-40 hover:opacity-100"
                }`}
              >
                {type === "grid" ? (
                  <LayoutGrid size={20} strokeWidth={2.5} />
                ) : (
                  <List size={20} strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-flow-accent group-focus-within:scale-110 transition-transform w-5 h-5" />
          <input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] outline-none font-black text-xs tracking-widest text-[var(--text-h)] focus:border-flow-accent/50 transition-all shadow-2xl backdrop-blur-xl placeholder:opacity-30"
          />
        </div>

        {/* Categories Grid */}
        <div
          className={`grid gap-8 ${
            viewType === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filtered.map((cat) => {
            const limit = budgetData?.categoryLimits?.[cat.name] || 0;
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
                className="relative bg-[var(--surface)] p-8 rounded-[3.5rem] border border-[var(--border)] shadow-2xl group transition-all duration-500 hover:translate-y-[-8px] hover:border-flow-accent/30 backdrop-blur-lg"
              >
                <div className="flex justify-between items-start mb-8">
                  {/* FIXED ICON CONTAINER: High contrast Teal/Black */}
                  <div className="p-5 rounded-[2rem] bg-flow-accent text-[#1a1a1a] shadow-lg shadow-flow-accent/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 border border-white/20">
                    {getIcon(cat.icon)}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === cat.id ? null : cat.id)
                      }
                      className="text-[var(--text)] opacity-30 hover:opacity-100 p-2 transition-all"
                    >
                      <MoreVertical size={22} />
                    </button>

                    {activeMenu === cat.id && (
                      <div className="absolute right-0 mt-3 w-40 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-30 overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => {
                            setCategoryToDelete(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-1xl font-black text-[var(--text-h)] mb-2 tracking-tighter">
                  {cat.name}
                </h3>

                <div className="flex justify-between items-end mb-4">
                  <span className="text-[9px] font-black text-[var(--text)] uppercase tracking-widest opacity-40">
                    Segment Flow
                  </span>
                  <span className="text-[var(--text-h)] text-xs font-black tracking-tight">
                    ₱{spent.toLocaleString()}{" "}
                    <span className="opacity-30">
                      / ₱{limit.toLocaleString()}
                    </span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden mb-4 border border-[var(--border)]">
                  <div
                    className={`h-full transition-all duration-[1500ms] ease-out shadow-lg ${
                      isNearLimit
                        ? "bg-rose-500 shadow-rose-500/40"
                        : "bg-flow-accent shadow-flow-accent/40"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <p
                    className={`text-[10px] font-black uppercase tracking-[0.15em] ${
                      isNearLimit
                        ? "text-rose-500 animate-pulse"
                        : "text-[var(--text)] opacity-40"
                    }`}
                  >
                    {isNearLimit
                      ? "LIMIT BREACH"
                      : `${Math.round(percent)}% UTILIZED`}
                  </p>
                  {isNearLimit && (
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Create New Category Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-10 rounded-[3.5rem] border-4 border-dashed border-[var(--border)] text-[var(--text)] opacity-30 hover:opacity-100 hover:border-flow-accent/50 hover:text-flow-accent transition-all duration-500 min-h-[300px] group bg-white/5 shadow-inner"
          >
            <div className="p-6 rounded-full bg-white/5 mb-6 group-hover:bg-flow-accent group-hover:text-[#1a1a1a] group-hover:scale-110 transition-all duration-500 shadow-xl">
              <Plus size={40} strokeWidth={3} />
            </div>
            <span className="font-black uppercase text-[11px] tracking-[0.3em]">
              Create new Category
            </span>
          </button>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={fetchData}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        categoryName={categoryToDelete?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Categories;
