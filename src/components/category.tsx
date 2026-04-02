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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;
    if (!userId) return;

    try {
      // Fetch Categories and Transactions in parallel from Supabase
      const [catRes, transRes] = await Promise.all([
        supabase.from("categories").select("*").eq("user_id", userId),
        supabase.from("transactions").select("*").eq("user_id", userId),
      ]);

      if (catRes.error) throw catRes.error;
      if (transRes.error) throw transRes.error;

      setCategories(catRes.data || []);
      setTransactions(transRes.data || []);
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
      // 1. Update transactions using this category to "UNCATEGORIZED"
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ category: "UNCATEGORIZED" })
        .eq("category", categoryToDelete.name)
        .eq("user_id", categoryToDelete.userId);

      if (updateError) throw updateError;

      // 2. Delete the actual category
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryToDelete.id);

      if (deleteError) throw deleteError;

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
          {/* View Toggle omitted for brevity, keep your existing UI here */}
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
            const spent = transactions
              .filter((t) => t.category === cat.name && t.type === "expense")
              .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

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
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[9px] font-black text-[var(--text)] uppercase tracking-widest opacity-40">
                    Segment Spent
                  </span>
                  <span className="text-[var(--text-h)] text-xs font-black">
                    ₱{spent.toLocaleString()}
                  </span>
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
