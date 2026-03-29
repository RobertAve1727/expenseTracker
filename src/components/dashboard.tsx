import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight } from "lucide-react";

const revenueData = [
  { name: "Jan", current: 4000, projection: 5000 },
  { name: "Feb", current: 3000, projection: 8000 },
  { name: "Mar", current: 6000, projection: 5500 },
  { name: "Apr", current: 2780, projection: 6000 },
  { name: "Jun", current: 1890, projection: 4800 },
  { name: "Jul", current: 2390, projection: 3800 },
];

const expenseData = [
  { name: "Goods", value: 23500, color: "#0EA5E9" },
  { name: "General", value: 17500, color: "#7C3AED" },
  { name: "Other", value: 12500, color: "#2DD4BF" },
  { name: "Fees", value: 4500, color: "#F43F5E" },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300">
      <main className="flex-1 p-6 lg:p-10 w-full">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome, Capital M 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Here's your store's performance.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm">
              6 Months
            </button>
          </div>
        </header>

        {/* FULL WIDTH GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
          <section className="xl:col-span-2 bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold dark:text-white mb-8">Revenue</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      backgroundColor: "#1e293b",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="current"
                    fill="#1e3a8a"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="projection"
                    fill="#60a5fa"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <MetricCard
              label="Total Projection"
              value="$500K"
              color="bg-blue-50 dark:bg-blue-500/10 text-blue-600"
            />
            <MetricCard
              label="Current Revenue"
              value="$250K"
              color="bg-purple-50 dark:bg-purple-500/10 text-purple-600"
            />
          </div>

          <section className="xl:col-span-2 bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold dark:text-white mb-8">Cashflow</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <h3 className="text-xl font-bold w-full mb-8 dark:text-white">
              Expenses
            </h3>
            <div className="relative h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-black dark:text-white">$80K</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value, color }: any) => (
  <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-400 transition-all">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
        {label}
      </p>
      <h3 className="text-4xl font-black dark:text-white tracking-tight">
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

export default Dashboard;
