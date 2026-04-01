import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Loader2,
} from "lucide-react"; // Added Loader2 for a nicer sync icon
import { useAuth } from "../services/useAuth";
import { TransactionService } from "../services/transactionService";
import { BudgetService } from "../services/budgetService";
import type { Transaction } from "../services/index";

const BudgetLimit = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [masterBudget, setMasterBudget] = useState<number | "">(0);

  // FIX: Initialize as an empty object to remove hard-coded categories
  const [limits, setLimits] = useState<Record<string, number | "">>({});

  const loadAllData = useCallback(async () => {
    const currentUserId =
      user?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!currentUserId) return;

    try {
      const [transactionData, budgetEntry, categoryData] = await Promise.all([
        TransactionService.getAllByUserId(currentUserId),
        BudgetService.getBudgetByUserId(currentUserId),
        fetch(`http://localhost:5000/categories?userId=${currentUserId}`).then(
          (res) => res.json(),
        ),
      ]);

      setTransactions(transactionData || []);

      // If categories exist, we map them. Even if no budget exists yet,
      // we show the categories with 0 limits so the user can set them.
      const mergedLimits: Record<string, number> = {};

      if (Array.isArray(categoryData)) {
        categoryData.forEach((cat: any) => {
          // Priority: 1. Saved Budget Limit, 2. Default to 0
          mergedLimits[cat.name] = budgetEntry?.categoryLimits?.[cat.name] || 0;
        });
      }

      setLimits(mergedLimits);
      if (budgetEntry) {
        setMasterBudget(budgetEntry.masterBudget);
      }
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleSave = async () => {
    const currentUserId =
      user?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!currentUserId) return;

    await BudgetService.saveBudget(currentUserId, {
      masterBudget: Number(masterBudget) || 0,
      categoryLimits: limits as any,
    });
    setIsEditing(false);
  };

  const handleNumberInput = (val: string) => (val === "" ? "" : Number(val));

  const budgetData = useMemo(() => {
    const spentByCat: Record<string, number> = {};
    let grandTotalSpent = 0;

    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const amt =
        Math.abs(parseFloat(t.amount.toString().replace(/[^\d.-]/g, ""))) || 0;
      grandTotalSpent += amt;
      spentByCat[t.category] = (spentByCat[t.category] || 0) + amt;
    });

    const cards = Object.keys(limits).map((key) => {
      const limitAmt = limits[key] === "" ? 0 : Number(limits[key]);
      const spentAmt = spentByCat[key] || 0;
      const percent =
        limitAmt > 0 ? Math.min((spentAmt / limitAmt) * 100, 100) : 0;
      const isCloseToLimit = limitAmt > 0 && spentAmt >= limitAmt * 0.8;
      const isOverLimit = limitAmt > 0 && spentAmt > limitAmt;

      return {
        key,
        name: key,
        limit: limitAmt,
        spent: spentAmt,
        percent,
        isWarning: isOverLimit || isCloseToLimit,
        statusColor: isOverLimit ? "text-rose-500" : "text-amber-400",
      };
    });

    const totalAllocated = Object.values(limits).reduce(
      (acc: number, cur) => acc + (Number(cur) || 0),
      0,
    );
    const mBudget = Number(masterBudget) || 0;
    const utilization =
      mBudget > 0 ? Math.min((grandTotalSpent / mBudget) * 100, 100) : 0;
    const isOverMaster = mBudget > 0 && grandTotalSpent > mBudget;

    return {
      cards,
      totalAllocated,
      unallocated: mBudget - totalAllocated,
      grandTotalSpent,
      utilization,
      isOverMaster,
    };
  }, [transactions, limits, masterBudget]);

  if (isLoading)
    return (
      <div className="flex-1 min-h-screen flex flex-col gap-4 items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <Loader2 className="animate-spin text-flow-accent" size={32} />
        <span className="font-black tracking-widest uppercase text-[10px] opacity-50">
          Syncing Ledger...
        </span>
      </div>
    );

  return (
    <div className="flex-1 p-6 lg:p-12 bg-[var(--bg)] min-h-screen">
      <header className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-5xl font-black text-[var(--text-h)] tracking-tighter">
            Budget Limits
          </h1>
          <p className="text-[var(--text)] text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-40">
            {isEditing
              ? "Precision Adjustment Mode"
              : "Financial Boundary Management"}
          </p>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="p-4 bg-[var(--surface)] text-[var(--text-h)] rounded-2xl font-black text-[10px] uppercase tracking-widest border border-[var(--border)] transition-all active:scale-95"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-flow-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-flow-accent/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <Save size={16} /> Deploy Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-[var(--surface)] text-[var(--text-h)] border border-[var(--border)] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:bg-white/5 active:scale-95 flex items-center gap-2"
            >
              <Edit2 size={16} /> Adjust Budgets
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Master Card */}
        <div className="lg:col-span-2 bg-[#16191e] p-10 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between min-h-[300px] border border-slate-800 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-flow-accent/5 blur-[100px]" />
          <div className="relative z-10">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
              Total Monthly Budget
            </p>
            {isEditing ? (
              <div className="flex items-center gap-4 bg-black/40 p-6 rounded-3xl border border-white/5 w-fit">
                <span className="text-4xl font-black text-flow-accent">₱</span>
                <input
                  type="number"
                  value={masterBudget}
                  onChange={(e) =>
                    setMasterBudget(handleNumberInput(e.target.value))
                  }
                  className="bg-transparent text-6xl font-black text-white outline-none w-full appearance-none tracking-tighter"
                  autoFocus
                />
              </div>
            ) : (
              <h2 className="text-8xl font-black text-white leading-none tracking-tighter">
                ₱{Number(masterBudget).toLocaleString()}
              </h2>
            )}
          </div>
          <div className="flex gap-16 text-sm mt-8 relative z-10">
            <div>
              <p className="text-slate-500 font-black mb-2 uppercase text-[9px] tracking-widest">
                Allocated
              </p>
              <p className="text-white font-black text-2xl tracking-tight">
                ₱{budgetData.totalAllocated.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-black mb-2 uppercase text-[9px] tracking-widest">
                Available
              </p>
              <p
                className={`${budgetData.unallocated < 0 ? "text-rose-500" : "text-flow-accent"} font-black text-2xl tracking-tight`}
              >
                ₱{budgetData.unallocated.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Global Utilization Card */}
        <div
          className={`bg-[var(--surface)] p-10 rounded-[3.5rem] border backdrop-blur-xl flex flex-col justify-between shadow-2xl transition-all duration-500 ${budgetData.isOverMaster ? "border-rose-500/30" : "border-[var(--border)]"}`}
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-black text-[var(--text)] opacity-40 uppercase tracking-[0.3em]">
                Monthly Stream
              </p>
              {budgetData.isOverMaster && (
                <AlertTriangle
                  size={20}
                  className="text-rose-500 animate-pulse"
                />
              )}
            </div>
            <h2
              className={`text-5xl font-black transition-colors duration-500 ${budgetData.isOverMaster ? "text-rose-500" : "text-[var(--text-h)]"}`}
            >
              ₱{budgetData.grandTotalSpent.toLocaleString()}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text)] opacity-50">
              <span>Utilization</span>
              <span>{Math.round(budgetData.utilization)}%</span>
            </div>
            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden p-1 border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${budgetData.isOverMaster ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "bg-flow-accent shadow-[0_0_15px_rgba(0,209,193,0.4)]"}`}
                style={{ width: `${budgetData.utilization}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Segment Capsules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {budgetData.cards.map((card) => (
          <div
            key={card.key}
            className={`bg-[var(--surface)] p-8 rounded-[3rem] border backdrop-blur-xl transition-all duration-500 ${isEditing ? "border-flow-accent/40 scale-[1.02]" : "border-[var(--border)]"}`}
          >
            <div className="flex justify-between items-center mb-8">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${card.isWarning ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-flow-accent/10 border-flow-accent/20 text-flow-accent"}`}
              >
                {card.isWarning ? (
                  <AlertTriangle size={20} strokeWidth={2.5} />
                ) : (
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                )}
              </div>
              <span className="text-[9px] font-black text-[var(--text)] opacity-40 uppercase tracking-[0.2em]">
                {card.name}
              </span>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 bg-black/10 p-4 rounded-2xl border border-white/5 mb-4">
                <span className="text-xl font-black text-flow-accent">₱</span>
                <input
                  type="number"
                  value={limits[card.key]}
                  onChange={(e) =>
                    setLimits({
                      ...limits,
                      [card.key]: handleNumberInput(e.target.value),
                    })
                  }
                  className="bg-transparent text-2xl font-black text-[var(--text-h)] outline-none w-full appearance-none"
                />
              </div>
            ) : (
              <p className="text-4xl font-black text-[var(--text-h)] mb-2 tracking-tighter">
                ₱{card.limit.toLocaleString()}
              </p>
            )}

            <p className="text-[10px] text-[var(--text)] font-black uppercase tracking-widest opacity-40 mb-8">
              Spent: ₱{card.spent.toLocaleString()}
            </p>

            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${card.percent >= 100 ? "bg-rose-500" : card.isWarning ? "bg-amber-400" : "bg-flow-accent"}`}
                style={{ width: `${card.percent}%` }}
              />
            </div>
          </div>
        ))}

        {/* Placeholder if no categories exist */}
        {budgetData.cards.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] rounded-[3rem] opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              No Segments Created
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetLimit;
