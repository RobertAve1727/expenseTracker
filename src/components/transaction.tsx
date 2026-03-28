import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Utensils,
  Car,
  Lightbulb,
  ShoppingBag,
} from "lucide-react";

// Types for our Transaction Feature
interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  type: "income" | "expense";
}

const TransactionPage: React.FC = () => {
  // Sample Data (In a real app, this would fetch from your JSON file/server)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 45.5,
      category: "Food",
      date: "2024-03-20",
      note: "Dinner with team",
      type: "expense",
    },
    {
      id: "2",
      amount: 2500,
      category: "Salary",
      date: "2024-03-19",
      note: "Monthly Pay",
      type: "income",
    },
    {
      id: "3",
      amount: 120,
      category: "Transport",
      date: "2024-03-18",
      note: "Gas fill up",
      type: "expense",
    },
    {
      id: "4",
      amount: 85,
      category: "Bills",
      date: "2024-03-15",
      note: "Electricity",
      type: "expense",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Logic: Filter transactions based on Search and Category (Feature #7)
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.note
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Helper to get Category Icons (Feature #3)
  const getIcon = (category: string) => {
    switch (category) {
      case "Food":
        return <Utensils size={16} />;
      case "Transport":
        return <Car size={16} />;
      case "Bills":
        return <Lightbulb size={16} />;
      default:
        return <ShoppingBag size={16} />;
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#0f1115] min-h-screen font-['Rubik'] text-slate-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">
            Keep track of your daily ins and outs.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e3] text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* FILTER & SEARCH BAR (Feature #7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by note..."
            className="w-full pl-12 pr-4 py-3 bg-[#1a1d23] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-[#1a1d23] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-[#6366f1] outline-none appearance-none transition-all cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
      </div>

      {/* TRANSACTION LIST (Feature #4) */}
      <div className="bg-[#1a1d23] border border-slate-800 rounded-4xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest">
              <th className="px-6 py-5 font-semibold">Transaction</th>
              <th className="px-6 py-5 font-semibold">Category</th>
              <th className="px-6 py-5 font-semibold">Date</th>
              <th className="px-6 py-5 font-semibold">Amount</th>
              <th className="px-6 py-5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredTransactions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-800/20 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${item.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
                    >
                      {item.type === "income" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {item.note}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                        {item.type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-800/40 w-fit px-3 py-1 rounded-lg border border-slate-700/50">
                    {getIcon(item.category)}
                    {item.category}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td
                  className={`px-6 py-4 font-bold text-sm ${item.type === "income" ? "text-emerald-400" : "text-white"}`}
                >
                  {item.type === "income" ? "+" : "-"}$
                  {item.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteTransaction(item.id)}
                    className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-600" size={30} />
            </div>
            <p className="text-slate-400 font-medium">No transactions found</p>
            <p className="text-slate-600 text-sm">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
