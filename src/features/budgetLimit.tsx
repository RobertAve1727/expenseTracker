import React, { useState, useMemo, useEffect, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Save, Edit2, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { TransactionService } from "../services/transactionService";
import { BudgetService } from "../services/budgetService";
import type { Transaction } from "../types/index";

const BudgetLimit = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Budget State
  const [masterBudget, setMasterBudget] = useState<number | "">(0);
  const [limits, setLimits] = useState<Record<string, number | "">>({
    Food: 0,
    Transport: 0,
    Bills: 0,
    Entertainment: 0,
  });

  // Load Data from Database
  const loadAllData = useCallback(async () => {
    const currentUserId =
      user?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!currentUserId) return;

    try {
      const [transactionData, budgetEntry] = await Promise.all([
        TransactionService.getAllByUserId(currentUserId),
        BudgetService.getBudgetByUserId(currentUserId),
      ]);

      setTransactions(transactionData || []);

      if (budgetEntry) {
        setMasterBudget(budgetEntry.masterBudget);
        setLimits(budgetEntry.categoryLimits);
      }
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAllData();
    // Refresh transactions every 5 seconds to catch new ones from other pages
    const interval = setInterval(loadAllData, 5000);
    return () => clearInterval(interval);
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
      if (t.type !== "Expense") return;
      // Convert "-₱300" or "-$250" to a clean positive number
      const amt =
        Math.abs(parseFloat(t.amount.toString().replace(/[^\d.-]/g, ""))) || 0;
      grandTotalSpent += amt;
      spentByCat[t.category] = (spentByCat[t.category] || 0) + amt;
    });

    const cards = Object.keys(limits).map((key) => {
      const limitAmt = limits[key] === "" ? 0 : Number(limits[key]);
      const spentAmt = spentByCat[key] || 0;
      const isOver = spentAmt > limitAmt && limitAmt > 0;

      return {
        key,
        name: key,
        limit: limitAmt,
        spent: spentAmt,
        percent: limitAmt > 0 ? Math.min((spentAmt / limitAmt) * 100, 100) : 0,
        isWarning: isOver || (key === "Bills" && limitAmt > 0),
      };
    });

    const totalAllocated = Object.values(limits).reduce(
      (acc: number, cur) => acc + (Number(cur) || 0),
      0,
    );
    const mBudget = Number(masterBudget) || 0;

    return {
      cards,
      totalAllocated,
      unallocated: mBudget - totalAllocated,
      grandTotalSpent,
      utilization: mBudget > 0 ? (grandTotalSpent / mBudget) * 100 : 0,
    };
  }, [transactions, limits, masterBudget]);

  if (isLoading)
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-white dark:bg-[#0f1115]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex-1 p-6 lg:p-10 bg-white dark:bg-[#0f1115] min-h-screen">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Budget Limits
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {isEditing
              ? "Modify your spending caps."
              : `Monthly limit: ₱${Number(masterBudget).toLocaleString()}`}
          </p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Edit2 size={18} /> Adjust Budgets
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-slate-950 p-8 rounded-[36px] relative overflow-hidden flex flex-col justify-between min-h-[260px] border border-slate-900 shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 -translate-y-1/2 translate-x-1/2 rounded-full border-[10px] border-slate-900/50" />
          <div className="relative z-10">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Master Budget
            </p>
            {isEditing ? (
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 w-fit">
                <span className="text-4xl font-black text-white">₱</span>
                <input
                  type="number"
                  value={masterBudget}
                  onChange={(e) =>
                    setMasterBudget(handleNumberInput(e.target.value))
                  }
                  className="bg-transparent text-6xl font-black text-white outline-none w-64"
                  placeholder="0"
                  autoFocus
                />
              </div>
            ) : (
              <h2 className="text-7xl font-black text-white leading-none">
                ₱{Number(masterBudget).toLocaleString()}
              </h2>
            )}
          </div>
          <div className="flex gap-12 text-sm mt-8 relative z-10">
            <div>
              <p className="text-slate-500 font-bold mb-1 uppercase text-[10px]">
                Allocated
              </p>
              <p className="text-white font-black text-xl">
                ₱{budgetData.totalAllocated.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-1 uppercase text-[10px]">
                Unallocated
              </p>
              <p
                className={`${budgetData.unallocated < 0 ? "text-rose-500" : "text-emerald-400"} font-black text-xl`}
              >
                ₱{budgetData.unallocated.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[36px] border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Total Monthly Spend
            </p>
            <h2 className="text-5xl font-black text-emerald-500">
              ₱{budgetData.grandTotalSpent.toLocaleString()}
            </h2>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mt-10">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${budgetData.utilization}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {budgetData.cards.map((card) => (
          <div
            key={card.key}
            className={`bg-white dark:bg-slate-900 p-7 rounded-[32px] border ${isEditing ? "border-indigo-500/30" : card.isWarning ? "border-rose-100 dark:border-rose-900" : "border-slate-100 dark:border-slate-800 shadow-sm"}`}
          >
            <div
              className={`w-9 h-9 rounded-full border-4 ${card.isWarning ? "border-rose-100" : "border-emerald-100"} mb-6 flex items-center justify-center bg-white shadow-sm`}
            >
              {card.isWarning ? (
                <AlertTriangle size={18} className="text-rose-500" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-500" />
              )}
            </div>
            <h4 className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest mb-1">
              {card.name}
            </h4>
            {isEditing ? (
              <div className="flex items-center gap-1 border-b-2 border-indigo-500/20 mb-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₱
                </span>
                <input
                  type="number"
                  value={limits[card.key]}
                  onChange={(e) =>
                    setLimits({
                      ...limits,
                      [card.key]: handleNumberInput(e.target.value),
                    })
                  }
                  className="bg-transparent text-3xl font-black text-slate-900 dark:text-white outline-none w-full py-1"
                  placeholder="0"
                />
              </div>
            ) : (
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 leading-none">
                ₱{card.limit.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-slate-500 font-semibold mb-6">
              Spent: ₱{card.spent.toLocaleString()}
            </p>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${card.isWarning ? "bg-rose-500" : "bg-indigo-600"} rounded-full`}
                style={{ width: `${card.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetLimit;
