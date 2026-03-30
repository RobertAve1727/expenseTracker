import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { TransactionService } from "../services/transactionService";
import type { Transaction } from "../types";

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const currentUserId =
        user?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;
      if (!currentUserId) return;

      try {
        setIsLoading(true);
        const [transData, budgetData] = await Promise.all([
          TransactionService.getAllByUserId(currentUserId),
          fetch(
            `http://localhost:5000/budgetLimits?userId=${currentUserId}`,
          ).then((res) => res.json()),
        ]);

        setTransactions(transData || []);
        const limitMap: Record<string, number> = {};
        budgetData.forEach((b: any) => {
          limitMap[b.category] = b.limit || 0;
        });
        setBudgetLimits(limitMap);
      } catch (err) {
        console.error("Dashboard Sync Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  const parseAmount = (amount: any): number => {
    if (typeof amount === "number") return Math.abs(amount);
    return (
      Math.abs(parseFloat(amount?.toString().replace(/[^\d.-]/g, ""))) || 0
    );
  };

  const totals = useMemo(() => {
    let income = 0,
      expense = 0;
    const categorySpent: Record<string, number> = {};
    transactions.forEach((t) => {
      const val = parseAmount(t.amount);
      if (t.type.toLowerCase() === "income") income += val;
      else {
        expense += val;
        categorySpent[t.category] = (categorySpent[t.category] || 0) + val;
      }
    });
    return {
      income: `₱${income.toLocaleString()}`,
      expense: `₱${expense.toLocaleString()}`,
      rawExpense: expense,
      categorySpent,
    };
  }, [transactions]);

  const barChartData = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map((t) => ({
        date: t.date,
        displayAmount: parseAmount(t.amount),
        type: t.type.toLowerCase(),
      }));
  }, [transactions]);

  const categoryPieData = useMemo(() => {
    const colors = [
      "#6366f1",
      "#a855f7",
      "#ec4899",
      "#f43f5e",
      "#fbbf24",
      "#10b981",
    ];
    return Object.entries(totals.categorySpent).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [totals.categorySpent]);

  if (isLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0f1115]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] transition-colors duration-500 min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hi, {user?.name || "Guest"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Financial Overview
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          <section className="xl:col-span-2 bg-white dark:bg-[#1a1d23] p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black dark:text-white">
                Daily Transactions
              </h3>
              <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10">
                Weekly Flux
              </span>
            </div>
            <div className="h-[350px] w-full">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#334155"
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                      contentStyle={{
                        borderRadius: "20px",
                        border: "none",
                        backgroundColor: "#1e293b",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="displayAmount"
                      radius={[8, 8, 0, 0]}
                      barSize={32}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.type === "income" ? "#10b981" : "#6366f1"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoDataPlaceholder message="No activity recorded yet" />
              )}
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <MetricCard
              label="Total Outflow"
              value={totals.expense}
              icon={<TrendingDown size={24} />}
              color="text-rose-500 bg-rose-500/5 border-rose-500/10"
            />
            <MetricCard
              label="Total Inflow"
              value={totals.income}
              icon={<TrendingUp size={24} />}
              color="text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
            />
            <section className="bg-white dark:bg-[#1a1d23] p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center">
              <h3 className="text-lg font-black w-full mb-6 dark:text-white">
                Spending Map
              </h3>
              <div className="relative h-[220px] w-full">
                {categoryPieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryPieData}
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryPieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Expenses
                      </p>
                      <p className="text-xl font-black dark:text-white">
                        ₱{totals.rawExpense.toLocaleString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <NoDataPlaceholder message="No categorical data" />
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Budget Watch */}
        <section className="bg-white dark:bg-[#1a1d23] p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-black dark:text-white uppercase tracking-wider">
              Budget Watch
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(budgetLimits).length > 0 ? (
              Object.entries(budgetLimits).map(([category, limit]) => {
                const spent = totals.categorySpent[category] || 0;
                const percentage = Math.min((spent / limit) * 100, 100);
                const isOver = spent > limit;
                return (
                  <div
                    key={category}
                    className="space-y-3 p-4 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50"
                  >
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black dark:text-slate-300 uppercase tracking-tighter">
                        {category}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${isOver ? "text-rose-500" : "text-slate-400"}`}
                      >
                        {limit > 0 ? Math.round(percentage) : 0}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${isOver ? "bg-rose-500" : "bg-indigo-500"}`}
                        style={{ width: `${limit > 0 ? percentage : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>₱{spent.toLocaleString()}</span>
                      <span>Limit ₱{limit.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-4 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                No budget limits set.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white dark:bg-[#1a1d23] p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group transition-all hover:border-indigo-500/30">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-[0.15em]">
        {label}
      </p>
      <h3 className="text-3xl font-black dark:text-white tracking-tight">
        {value}
      </h3>
    </div>
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${color}`}
    >
      {icon}
    </div>
  </div>
);

const NoDataPlaceholder = ({ message }: { message: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      <AlertCircle size={20} className="opacity-40" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
      {message}
    </span>
  </div>
);

export default Dashboard;
