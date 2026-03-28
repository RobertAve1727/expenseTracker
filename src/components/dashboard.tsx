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
  { name: "January", current: 4000, projection: 5000 },
  { name: "February", current: 3000, projection: 8000 },
  { name: "March", current: 6000, projection: 5500 },
  { name: "April", current: 2780, projection: 6000 },
  { name: "June", current: 1890, projection: 4800 },
  { name: "July", current: 2390, projection: 3800 },
];

const expenseData = [
  { name: "Goods", value: 23500, color: "#0EA5E9" },
  { name: "General", value: 17500, color: "#7C3AED" },
  { name: "Other", value: 12500, color: "#2DD4BF" },
  { name: "Fees", value: 4500, color: "#F43F5E" },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome, Capital M 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              $ USD
            </button>
            <button className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              6 Months
            </button>
          </div>
        </header>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Revenue Chart */}
          <section className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Revenue</h3>
              <div className="flex gap-6">
                <LegendItem color="bg-[#1e3a8a]" label="Current" />
                <LegendItem color="bg-[#60a5fa]" label="Projection" />
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="current"
                    fill="#1e3a8a"
                    radius={[6, 6, 0, 0]}
                    barSize={16}
                  />
                  <Bar
                    dataKey="projection"
                    fill="#60a5fa"
                    radius={[6, 6, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Key Metric Cards */}
          <div className="flex flex-col gap-6">
            <MetricCard
              label="Revenue projection"
              value="$500K"
              sub="6 Months"
              color="bg-blue-50 text-blue-600"
            />
            <MetricCard
              label="Current revenue"
              value="$250K"
              sub="Current Month"
              color="bg-purple-50 text-purple-600"
            />
          </div>

          {/* Cashflow Line Chart */}
          <section className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Cashflow</h3>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold bg-white rounded-md shadow-sm">
                  Income
                </button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500">
                  Expenses
                </button>
              </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#0ea5e9"
                    strokeWidth={4}
                    dot={{
                      r: 4,
                      fill: "#0ea5e9",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="projection"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={false}
                    opacity={0.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Expenses Pie Chart */}
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-xl font-bold w-full mb-8">Expenses</h3>
            <div className="relative h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-extrabold">$80K</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  6 Months
                </p>
              </div>
            </div>
            <div className="w-full mt-8 grid grid-cols-2 gap-4">
              {expenseData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs font-medium text-slate-500">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold">
                    {(item.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components ---
const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-xs font-bold text-slate-500">{label}</span>
  </div>
);

const MetricCard = ({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) => (
  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-4xl font-black tracking-tight">{value}</h3>
      <p className="text-[10px] font-bold text-slate-400 mt-2">{sub}</p>
    </div>
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}
    >
      <ArrowUpRight size={28} />
    </div>
  </div>
);

export default Dashboard;
