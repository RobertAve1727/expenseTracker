import React, { useEffect, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Zap,
  Calendar,
  Target,
  Clock,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const SmartInsights = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;
    if (!userId) return;

    try {
      const [transRes, budgetRes] = await Promise.all([
        fetch(`http://localhost:5000/transactions?userId=${userId}`),
        fetch(`http://localhost:5000/budgets?userId=${userId}`),
      ]);
      setTransactions(await transRes.json());
      const bData = await budgetRes.json();
      setBudgetData(bData[0]);
    } catch (e) {
      console.error("Analysis Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ANALYSIS LOGIC ---
  const expenses = transactions.filter((t) => t.type === "expense");
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const currentDay = today.getDate() || 1;

  // 1. Spending Forecast
  const totalSpent = expenses.reduce(
    (s, t) => s + parseFloat(t.amount.toString().replace(/[^\d.-]/g, "")),
    0,
  );
  const dailyAverage = totalSpent / currentDay;
  const projectedMonthly = dailyAverage * daysInMonth;
  const totalLimit = budgetData?.totalLimit || 0;
  const isOverBudget = projectedMonthly > totalLimit;

  // 2. Weekend Analysis (Saturday = 6, Sunday = 0)
  const weekendSpending = expenses
    .filter((t) => {
      const day = new Date(t.date).getDay();
      return day === 0 || day === 6;
    })
    .reduce(
      (s, t) => s + parseFloat(t.amount.toString().replace(/[^\d.-]/g, "")),
      0,
    );
  const weekendRatio = totalSpent > 0 ? weekendSpending / totalSpent : 0;

  // 3. Habit Frequency (The "Coffee Shop" effect)
  const frequencyMap: Record<string, number> = {};
  expenses.forEach((t) => {
    frequencyMap[t.category] = (frequencyMap[t.category] || 0) + 1;
  });
  const topHabit = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0];

  if (loading)
    return (
      <div className="p-10 text-center dark:text-white font-black uppercase tracking-[0.3em] animate-pulse">
        Analyzing Patterns...
      </div>
    );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-indigo-500 animate-pulse" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
              AI Financial Intelligence
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Smart Insights
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
            Predictive Behavior & Trends
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PROJECTION CARD */}
          <div className="md:col-span-2 bg-white dark:bg-[#1a1d23] p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -bottom-4 text-slate-100 dark:text-slate-800/50 w-48 h-48 -rotate-12 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-8">
                Monthly Forecast
              </h3>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                  ₱{Math.round(projectedMonthly).toLocaleString()}
                </span>
                <span className="text-slate-400 font-bold">/ project.</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-medium">
                At your current rate of{" "}
                <span className="text-slate-900 dark:text-white font-bold">
                  ₱{Math.round(dailyAverage).toLocaleString()}/day
                </span>
                , you will end the month{" "}
                {isOverBudget ? (
                  <span className="text-rose-500 font-bold">
                    ₱
                    {Math.round(projectedMonthly - totalLimit).toLocaleString()}{" "}
                    over budget.
                  </span>
                ) : (
                  <span className="text-emerald-500 font-bold">
                    well within your limits.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* BURN RATE CARD */}
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
            <Zap size={40} className="mb-10" />
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                Daily Burn Rate
              </h3>
              <p className="text-4xl font-black mb-2">
                ₱{Math.round(dailyAverage).toLocaleString()}
              </p>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>

          {/* BEHAVIORAL: WEEKEND VS WEEKDAY */}
          <div className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 group">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl w-fit mb-6 group-hover:rotate-12 transition-transform">
              <Clock size={24} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Time Analysis
            </h3>
            <p className="text-slate-900 dark:text-white font-bold leading-snug">
              {weekendRatio > 0.4
                ? "Weekend Spike Detected: You spend roughly 40%+ of your budget on Saturdays and Sundays."
                : "Steady Spender: Your expenses are distributed evenly across the week."}
            </p>
          </div>

          {/* BEHAVIORAL: FREQUENCY HABIT */}
          <div className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 group">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mb-6 group-hover:rotate-12 transition-transform">
              <Activity size={24} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Spending Habit
            </h3>
            <p className="text-slate-900 dark:text-white font-bold leading-snug">
              Your most frequent activity is in{" "}
              <span className="text-indigo-500">
                "{topHabit?.[0] || "N/A"}"
              </span>
              . Small recurring costs here are the main drivers of your burn
              rate.
            </p>
          </div>

          {/* ACTIONABLE GOAL */}
          <div className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 group">
            <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl w-fit mb-6 group-hover:rotate-12 transition-transform">
              <Target size={24} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Smart Goal
            </h3>
            <p className="text-slate-900 dark:text-white font-bold leading-snug">
              Cut{" "}
              <span className="underline decoration-rose-500/30">
                {topHabit?.[0]}
              </span>{" "}
              frequency by 15% next month to save approximately
              <span className="text-emerald-500 ml-1">
                ₱{Math.round(totalSpent * 0.05).toLocaleString()}
              </span>
              .
            </p>
          </div>
        </div>

        {/* BOTTOM ADVISORY */}
        <div className="mt-12 p-8 bg-slate-900 dark:bg-indigo-950/40 border border-indigo-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white rotate-3">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-white font-black text-lg">
                Financial Health Status
              </p>
              <p className="text-indigo-300/60 text-sm font-bold uppercase tracking-widest">
                {isOverBudget ? "Adjustment Recommended" : "Optimal Path"}
              </p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/budget")}
            className="flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
          >
            Optimize Budget <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
