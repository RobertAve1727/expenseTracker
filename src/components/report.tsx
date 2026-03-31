import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import type { Category } from "../services";

const Reports = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = user.id;
    if (!userId) return;

    try {
      const [catRes, transRes] = await Promise.all([
        fetch(`http://localhost:5000/categories?userId=${userId}`),
        fetch(`http://localhost:5000/transactions?userId=${userId}`),
      ]);

      setCategories(await catRes.json());
      setTransactions(await transRes.json());
    } catch (error) {
      console.error("Reports Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Logic
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;

  // Category Breakdown
  const categoryStats = categories
    .map((cat) => {
      const amount = transactions
        .filter((t) => t.category === cat.name && t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return { name: cat.name, amount, color: cat.color };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (loading)
    return (
      <div className="p-10 text-center dark:text-white font-black uppercase tracking-widest">
        Generating Insights...
      </div>
    );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#0f1115] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Reports
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
            Financial Health & Patterns
          </p>
        </header>

        {/* Top Cards: The Big Picture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ReportCard
            title="Total Income"
            amount={totalIncome}
            icon={<TrendingUp className="text-emerald-500" />}
            color="emerald"
          />
          <ReportCard
            title="Total Expenses"
            amount={totalExpenses}
            icon={<TrendingDown className="text-rose-500" />}
            color="rose"
          />
          <ReportCard
            title="Net Savings"
            amount={netSavings}
            icon={<BarChart3 className="text-indigo-500" />}
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending by Category */}
          <section className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none">
            <div className="flex items-center gap-3 mb-8">
              <PieIcon className="text-indigo-500" />
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">
                Spending Allocation
              </h2>
            </div>

            <div className="space-y-6">
              {categoryStats.map((stat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {stat.name}
                    </span>
                    <span className="font-black dark:text-white">
                      ₱{stat.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{
                        width: `${(stat.amount / totalExpenses) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Insights Grid */}
          <section className="space-y-6">
            <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-500/20">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">
                Smart Insight
              </h3>
              <p className="text-xl font-bold leading-tight">
                {netSavings > 0
                  ? `You've saved ₱${netSavings.toLocaleString()} this month. That's ${((netSavings / totalIncome) * 100).toFixed(1)}% of your income!`
                  : "Your expenses have exceeded your income. Consider reviewing your 'Uncategorized' spending."}
              </p>
              <button className="mt-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-all px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                Improve Habits <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-slate-400" />
                <h3 className="font-black dark:text-white uppercase tracking-widest text-xs">
                  Recent History
                </h3>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Showing patterns from the last {transactions.length} entries.
                Keep logging to sharpen your AI insights.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Reusable Small Card
const ReportCard = ({ title, amount, icon, color }: any) => (
  <div className="bg-white dark:bg-[#1a1d23] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10`}>{icon}</div>
    </div>
    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
      {title}
    </h3>
    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
      ₱{Math.abs(amount).toLocaleString()}
    </p>
  </div>
);

export default Reports;
