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
import { useAuth } from "../services/useAuth";
import { TransactionService } from "../services/transactionService";
import type { Transaction } from "../services";

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
      <div className="flex min-h-screen w-full items-center justify-center bg-transparent">
        <Loader2 className="w-10 h-10 animate-spin text-flow-accent" />
      </div>
    );

  return (
    <div className="p-6 lg:p-10 bg-transparent min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[var(--text-h)] tracking-tighter">
            Hi, {user?.name || "Guest"}
          </h1>
          <p className="text-[var(--text)] text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-70">
            Financial Intelligence Overview
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          {/* Main Chart */}
          <section className="xl:col-span-2 bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--border)] backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-[var(--text-h)] uppercase tracking-widest">
                Activity
              </h3>
              <span className="text-[10px] font-black uppercase text-flow-accent bg-flow-accent/5 px-3 py-1.5 rounded-full border border-flow-accent/10">
                7-Day Flux
              </span>
            </div>
            <div className="h-[350px] w-full">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      opacity={0.05}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "var(--text)",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "var(--text)",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--surface)",
                        color: "var(--text-h)",
                      }}
                    />
                    <Bar
                      dataKey="displayAmount"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.type === "income"
                              ? "#10b981"
                              : "var(--flow-accent, #6366f1)"
                          }
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
            {/* Spending Map */}
            <section className="bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--border)] backdrop-blur-md flex-1 flex flex-col items-center">
              <h3 className="text-sm font-black w-full mb-6 text-[var(--text-h)] uppercase tracking-widest">
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
                      <p className="text-[10px] font-black text-[var(--text)] uppercase tracking-widest opacity-50">
                        Expenses
                      </p>
                      <p className="text-xl font-black text-[var(--text-h)]">
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
        <section className="bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--border)] backdrop-blur-md shadow-2xl mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-flow-accent/10 rounded-xl text-flow-accent">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-black text-[var(--text-h)] uppercase tracking-widest">
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
                    className="space-y-4 p-5 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-[var(--border)]"
                  >
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-[var(--text-h)] uppercase">
                        {category}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${isOver ? "text-rose-500" : "text-[var(--text)]"}`}
                      >
                        {limit > 0 ? Math.round(percentage) : 0}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${isOver ? "bg-rose-500" : "bg-flow-accent"}`}
                        style={{ width: `${limit > 0 ? percentage : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-[var(--text)] uppercase tracking-tighter opacity-70">
                      <span>₱{spent.toLocaleString()}</span>
                      <span>Limit ₱{limit.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center text-[var(--text)] text-xs font-bold uppercase tracking-widest opacity-30">
                No active budget constraints.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, color }: any) => (
  <div className="bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--border)] backdrop-blur-md flex items-center justify-between group transition-all hover:translate-y-[-2px] hover:border-flow-accent/40">
    <div>
      <p className="text-[10px] font-black text-[var(--text)] uppercase mb-1 tracking-[0.2em] opacity-60">
        {label}
      </p>
      <h3 className="text-3xl font-black text-[var(--text-h)] tracking-tighter">
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
  <div className="h-full flex flex-col items-center justify-center text-[var(--text)] gap-3 opacity-40">
    <AlertCircle size={20} />
    <span className="text-[10px] font-black uppercase tracking-widest">
      {message}
    </span>
  </div>
);

export default Dashboard;
