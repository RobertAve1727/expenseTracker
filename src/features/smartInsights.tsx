import { useEffect, useState } from "react";
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
import { TransactionService } from "../services/transactionService";
import { BudgetService } from "../services/budgetService";
import { useAuth } from "../services/useAuth";

const SmartInsights = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // Priority: useAuth state, fallback to sessionStorage
    const sessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user?.id || sessionUser?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Use your existing services instead of localhost fetch
      const [transRes, budgetRes] = await Promise.all([
        TransactionService.getAllByUserId(userId),
        BudgetService.getBudgetByUserId(userId),
      ]);

      setTransactions(transRes || []);
      setBudgetData(budgetRes);
    } catch (e) {
      console.error("Analysis Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  // --- ANALYSIS LOGIC ---
  const expenses = transactions.filter((t) => t.type === "expense");
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const currentDay = today.getDate() || 1;

  const totalSpent = expenses.reduce(
    (s, t) =>
      s + Math.abs(parseFloat(t.amount.toString().replace(/[^\d.-]/g, ""))),
    0,
  );

  const dailyAverage = totalSpent / currentDay;
  const projectedMonthly = dailyAverage * daysInMonth;

  // Mapping Supabase 'master_budget' to local 'totalLimit'
  const totalLimit = budgetData?.master_budget || 0;
  const isOverBudget = totalLimit > 0 && projectedMonthly > totalLimit;

  const weekendSpending = expenses
    .filter((t) => {
      const day = new Date(t.date).getDay();
      return day === 0 || day === 6;
    })
    .reduce(
      (s, t) =>
        s + Math.abs(parseFloat(t.amount.toString().replace(/[^\d.-]/g, ""))),
      0,
    );

  const weekendRatio = totalSpent > 0 ? weekendSpending / totalSpent : 0;

  const frequencyMap: Record<string, number> = {};
  expenses.forEach((t) => {
    frequencyMap[t.category] = (frequencyMap[t.category] || 0) + 1;
  });
  const topHabit = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0];

  if (loading)
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Analyzing Patterns...
      </div>
    );

  return (
    <div className="flex-1 p-6 lg:p-12 bg-[var(--bg)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-flow-accent animate-pulse" size={18} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-flow-accent">
              AI Financial Intelligence
            </span>
          </div>
          <h1 className="text-5xl font-black text-[var(--text-h)] tracking-tighter">
            Smart Insights
          </h1>
          <p className="text-[var(--text)] text-[10px] font-black uppercase tracking-widest mt-3 opacity-40">
            Predictive Behavior & Trends
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PROJECTION CARD */}
          <div className="md:col-span-2 bg-[#16191e] p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <TrendingUp className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64 -rotate-12 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10">
              <h3 className="text-[11px] font-black text-flow-accent uppercase tracking-widest mb-10">
                Monthly Forecast
              </h3>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-8xl font-black text-white tracking-tighter leading-none">
                  ₱{Math.round(projectedMonthly).toLocaleString()}
                </span>
                <span className="text-slate-500 font-bold">/ project.</span>
              </div>
              <p className="text-slate-400 max-w-lg text-sm font-medium leading-relaxed">
                At your current rate of{" "}
                <span className="text-white font-bold">
                  ₱{Math.round(dailyAverage).toLocaleString()}/day
                </span>
                , you will end the month{" "}
                {totalLimit === 0 ? (
                  <span className="text-slate-500 italic">
                    {" "}
                    (No budget limit set)
                  </span>
                ) : isOverBudget ? (
                  <span className="text-rose-500 font-bold">
                    ₱
                    {Math.round(projectedMonthly - totalLimit).toLocaleString()}{" "}
                    over budget.
                  </span>
                ) : (
                  <span className="text-flow-accent font-bold">
                    well within your limits.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* BURN RATE CARD */}
          <div className="bg-flow-accent p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl shadow-flow-accent/20 relative overflow-hidden group">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md mb-10 group-hover:rotate-12 transition-transform">
              <Zap size={32} fill="white" />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-3">
                Daily Burn Rate
              </h3>
              <p className="text-5xl font-black mb-6 tracking-tighter leading-none">
                ₱{Math.round(dailyAverage).toLocaleString()}
              </p>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ width: "65%" }} // You could calculate this based on (dailyAverage / (totalLimit/30)) * 100
                />
              </div>
            </div>
          </div>

          {/* BEHAVIORAL: TIME ANALYSIS */}
          <div className="bg-[var(--surface)] p-10 rounded-[3rem] border border-[var(--border)] backdrop-blur-xl group hover:border-flow-accent/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
              <Clock size={24} strokeWidth={3} />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Time Analysis
            </h3>
            <p className="text-[var(--text-h)] font-bold leading-snug">
              {weekendRatio > 0.4
                ? "Weekend Spike Detected: You spend roughly 40%+ of your budget on Saturdays and Sundays."
                : "Steady Spender: Your expenses are distributed evenly across the week."}
            </p>
          </div>

          {/* BEHAVIORAL: HABIT */}
          <div className="bg-[var(--surface)] p-10 rounded-[3rem] border border-[var(--border)] backdrop-blur-xl group hover:border-flow-accent/30 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
              <Activity size={24} strokeWidth={3} />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Spending Habit
            </h3>
            <p className="text-[var(--text-h)] font-bold leading-snug">
              Your most frequent activity is in{" "}
              <span className="text-flow-accent">
                "{topHabit?.[0] || "N/A"}"
              </span>
              . Small recurring costs here are the main drivers of your burn
              rate.
            </p>
          </div>

          {/* ACTIONABLE GOAL */}
          <div className="bg-[var(--surface)] p-10 rounded-[3rem] border border-[var(--border)] backdrop-blur-xl group hover:border-flow-accent/30 transition-all">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
              <Target size={24} strokeWidth={3} />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Smart Goal
            </h3>
            <p className="text-[var(--text-h)] font-bold leading-snug">
              Cut{" "}
              <span className="underline decoration-rose-500/30">
                {topHabit?.[0] || "this category"}
              </span>{" "}
              frequency by 15% next month to save approximately
              <span className="text-flow-accent ml-1">
                ₱{Math.round(totalSpent * 0.05).toLocaleString()}
              </span>
              .
            </p>
          </div>
        </div>

        {/* BOTTOM ADVISORY */}
        <div className="mt-16 p-10 bg-[#b3b3b3]/90 backdrop-blur-2xl border border-white/20 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-flow-accent text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-flow-accent/30 rotate-3">
              <Calendar size={32} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[#1a1a1a] font-black text-2xl tracking-tighter leading-none mb-2">
                Financial Health Status
              </p>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                {isOverBudget ? "Adjustment Recommended" : "Optimal Path"}
              </p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/budget")}
            className="flex items-center gap-3 bg-[#1a1a1a] text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:brightness-125 transition-all active:scale-95 shadow-xl"
          >
            Optimize Budget <ArrowUpRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
