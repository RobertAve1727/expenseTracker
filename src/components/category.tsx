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
import { supabase } from "../services/supabaseClient";
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
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;
    if (!userId) return;

    try {
      // Fetch Categories, Transactions, and Budgets in parallel
      const [catRes, transRes, budgetRes] = await Promise.all([
        supabase.from("categories").select("*").eq("user_id", userId),
        supabase.from("transactions").select("*").eq("user_id", userId),
        supabase
          .from("budgets")
          .select("category_limits")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if (catRes.error) throw catRes.error;
      if (transRes.error) throw transRes.error;

      setCategories(catRes.data || []);
      setTransactions(transRes.data || []);
      setCategoryLimits(budgetRes.data?.category_limits || {});
    } catch (error) {
      console.error("Supabase Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const userSession = JSON.parse(sessionStorage.getItem("user") || "{}");
      const userId = userSession.id;

      // 1. Move connected transactions to UNCATEGORIZED
      // Ensure the casing matches your DB data (usually uppercase based on your Modal logic)
      const targetCategoryName = categoryToDelete.name.toUpperCase();

      const { error: updateError } = await supabase
        .from("transactions")
        .update({ category: "UNCATEGORIZED" })
        .eq("user_id", userId)
        .eq("category", targetCategoryName);

      if (updateError) throw updateError;

      // 2. Perform the Category Delete
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryToDelete.id)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // 3. UI Cleanup
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setActiveMenu(null);

      // Refresh all data to ensure Budget/Transaction lists are accurate
      await fetchData();
    } catch (e: any) {
      console.error("Deletion failed:", e.message);
      alert(`Sync Error: ${e.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="p-6 lg:p-12 bg-[var(--bg)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black text-[var(--text-h)] tracking-tighter">
              Categories
            </h1>
            <p className="text-[var(--text)] text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-50">
              Manage Spending Segments
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-flow-accent w-5 h-5" />
          <input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] outline-none font-black text-xs tracking-widest text-[var(--text-h)] focus:border-flow-accent/50 transition-all shadow-2xl backdrop-blur-xl"
          />
        </div>

        <div
          className={`grid gap-8 ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          {filtered.map((cat) => {
            // Calculation logic
            const spent = transactions
              .filter((t) => t.category === cat.name && t.type === "expense")
              .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

            const limit = categoryLimits[cat.name] || 0;
            const utilization = limit > 0 ? (spent / limit) * 100 : 0;
            const isOver = utilization > 100;

            return (
              <div
                key={cat.id}
                className="relative bg-[var(--surface)] p-8 rounded-[3.5rem] border border-[var(--border)] shadow-2xl group transition-all duration-500 hover:translate-y-[-8px] backdrop-blur-lg"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-5 rounded-[2rem] bg-flow-accent text-[#1a1a1a] shadow-lg border border-white/20">
                    {getIcon(cat.icon)}
                  </div>
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === cat.id ? null : cat.id)
                    }
                    className="text-[var(--text)] opacity-30 hover:opacity-100"
                  >
                    <MoreVertical size={22} />
                  </button>
                  {activeMenu === cat.id && (
                    <div className="absolute right-8 mt-12 w-40 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-30 overflow-hidden">
                      <button
                        onClick={() => {
                          setCategoryToDelete(cat);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 uppercase tracking-widest"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-black text-[var(--text-h)] mb-2 tracking-tighter">
                  {cat.name}
                </h3>

                <div className="flex justify-between items-end mb-6">
                  <span className="text-[9px] font-black text-[var(--text)] uppercase tracking-widest opacity-40">
                    Spent
                  </span>
                  <span className="text-[var(--text-h)] text-xs font-black">
                    ₱{spent.toLocaleString()}
                  </span>
                </div>

                {/* Utilization Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="opacity-40">Usage</span>
                    <span
                      className={isOver ? "text-rose-500" : "text-flow-accent"}
                    >
                      {limit > 0 ? `${Math.round(utilization)}%` : "No Limit"}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full transition-all duration-1000 ${isOver ? "bg-rose-500" : "bg-flow-accent"}`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>

                  {limit > 0 && (
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[8px] font-bold opacity-20 uppercase tracking-tighter italic">
                        Cap
                      </span>
                      <span className="text-[10px] font-black text-[var(--text-h)] opacity-60">
                        ₱{limit.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-10 rounded-[3.5rem] border-4 border-dashed border-[var(--border)] text-[var(--text)] opacity-30 hover:opacity-100 hover:border-flow-accent/50 hover:text-flow-accent transition-all min-h-[250px] bg-white/5"
          >
            <Plus size={40} strokeWidth={3} className="mb-4" />
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
