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
import { ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { TransactionService } from "../services/transactionService";
import type { Transaction } from "../types";

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Check for user.id specifically as that's what the service needs
      const currentUserId =
        user?.id || JSON.parse(localStorage.getItem("user") || "{}")?.id;

      if (!currentUserId) return;

      try {
        setIsLoading(true);
        const data = await TransactionService.getAllByUserId(currentUserId);
        setTransactions(data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  const parseAmount = (amountStr: any) => {
    if (typeof amountStr === "number") return Math.abs(amountStr);
    if (!amountStr) return 0;
    return (
      Math.abs(parseFloat(amountStr.toString().replace(/[^\d.-]/g, ""))) || 0
    );
  };

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      const val = parseAmount(t.amount);
      if (t.type === "Income") income += val;
      else expense += val;
    });

    return {
      income: `₱${income.toLocaleString()}`,
      expense: `₱${expense.toLocaleString()}`,
      rawExpense: expense,
    };
  }, [transactions]);

  // Data for Bar Chart: Sort by date and take last 6
  const barChartData = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-6)
      .map((t) => ({
        ...t,
        displayAmount: parseAmount(t.amount),
      }));
  }, [transactions]);

  const categoryPieData = useMemo(() => {
    const groups: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "Expense")
      .forEach((t) => {
        groups[t.category] = (groups[t.category] || 0) + parseAmount(t.amount);
      });

    const colors = [
      "#6366f1",
      "#a855f7",
      "#ec4899",
      "#f43f5e",
      "#eab308",
      "#22c55e",
    ];
    return Object.entries(groups).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0f1115]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300">
      <main className="flex-1 p-6 lg:p-10 w-full max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome, {user?.name || "Guest"} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Your financial health at a glance.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
          {/* Main Bar Chart Section */}
          <section className="xl:col-span-2 bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold dark:text-white mb-8">
              Recent Activity
            </h3>
            <div className="h-[350px] w-full">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        backgroundColor: "#1e293b",
                        color: "#fff",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="displayAmount"
                      name="Amount"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoDataPlaceholder message="No recent transactions found" />
              )}
            </div>
          </section>

          {/* Metric Cards */}
          <div className="flex flex-col gap-6">
            <MetricCard
              label="Total Expenses"
              value={totals.expense}
              color="bg-rose-50 dark:bg-rose-500/10 text-rose-600"
            />
            <MetricCard
              label="Total Income"
              value={totals.income}
              color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
            />
          </div>

          {/* Expenses Pie Chart */}
          <section className="bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <h3 className="text-xl font-bold w-full mb-8 dark:text-white">
              Distribution
            </h3>
            <div className="relative h-[280px] w-full">
              {categoryPieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        innerRadius={80}
                        outerRadius={105}
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Out
                    </p>
                    <p className="text-2xl font-black dark:text-white">
                      ₱{totals.rawExpense.toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <NoDataPlaceholder message="No expense data" />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-md transition-all">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">
        {label}
      </p>
      <h3 className="text-3xl font-black dark:text-white tracking-tight">
        {value}
      </h3>
    </div>
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
    >
      <ArrowUpRight size={28} />
    </div>
  </div>
);

const NoDataPlaceholder = ({ message }: { message: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
    <AlertCircle size={24} className="opacity-20" />
    <span className="italic text-sm">{message}</span>
  </div>
);

export default Dashboard;
