import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowUpDown,
  PieChart,
  Target,
  Search,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
  FolderTree,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Pulling from sessionStorage now
  const savedUser =
    user || JSON.parse(sessionStorage.getItem("user") || "null");

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();

    // Explicitly clear session on logout
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));

    navigate("/login");
  };

  return (
    <aside
      className="w-64 bg-white dark:bg-[#0f1115] text-slate-500 dark:text-slate-400 flex flex-col p-6 border-r border-slate-200 dark:border-slate-800/50 h-screen sticky top-0 font-sans transition-colors duration-300
      overflow-y-auto
      [&::-webkit-scrollbar]:w-1.5
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-slate-200
      dark:[&::-webkit-scrollbar-thumb]:bg-slate-800
      [&::-webkit-scrollbar-thumb]:rounded-full
      hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/50"
    >
      <Link
        to="/dashboard"
        className="flex items-center gap-3 text-slate-900 dark:text-white mb-8 px-2 flex-shrink-0"
      >
        <div className="bg-[#6366f1] p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
          <div className="w-5 h-5 border-2 border-white rotate-45 flex items-center justify-center">
            <div className="w-0.5 h-2 bg-white -rotate-45"></div>
          </div>
        </div>
        <span className="font-bold text-lg tracking-tight">ZeroBalance</span>
      </Link>

      <div className="relative mb-6 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-slate-100 dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 text-xs text-slate-900 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>

      <nav className="flex-1 space-y-1 pr-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3 px-2">
          Overview
        </p>
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <NavItem
          to="/transactions"
          icon={<ArrowUpDown size={18} />}
          label="Transactions"
        />
        <NavItem
          to="/categories"
          icon={<FolderTree size={18} />}
          label="Categories"
        />

        <div className="pt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3 px-2">
            Planning & Analytics
          </p>
          <NavItem
            to="/budget"
            icon={<Target size={18} />}
            label="Budget Limits"
          />
          <NavItem
            to="/reports"
            icon={<PieChart size={18} />}
            label="Reports"
          />
          <NavItem
            to="/insights"
            icon={<TrendingUp size={18} />}
            label="Smart Insights"
          />
        </div>

        <div className="pt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3 px-2">
            System
          </p>
          <NavItem
            to="/alerts"
            icon={<Bell size={18} />}
            label="Alerts"
            badge="3"
          />
          <NavItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Settings"
          />
          <NavItem
            to="/support"
            icon={<HelpCircle size={18} />}
            label="Support"
          />
        </div>
      </nav>

      <div className="mt-auto flex items-center gap-3 p-2 border-t border-slate-200 dark:border-slate-800/50 pt-6 flex-shrink-0 bg-white dark:bg-[#0f1115]">
        <div className="relative">
          <img
            src={`https://ui-avatars.com/api/?name=${savedUser?.name || "User"}&background=6366f1&color=fff`}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 object-cover"
            alt="user"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 border-2 border-white dark:border-[#0f1115] rounded-full"></div>
        </div>
        <div className="overflow-hidden flex-1 ml-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {savedUser?.name || "Guest User"}
          </p>
          <p className="text-[10px] truncate text-slate-500 tracking-tight">
            {savedUser?.email || "not logged in"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({
  icon,
  label,
  to,
  badge,
}: {
  icon: any;
  label: string;
  to: string;
  badge?: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group
      ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1a1d23] hover:text-slate-900 dark:hover:text-white"}
    `}
  >
    <div className="flex items-center gap-3">
      <span className="transition-colors">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
        {badge}
      </span>
    )}
  </NavLink>
);

export default Sidebar;
