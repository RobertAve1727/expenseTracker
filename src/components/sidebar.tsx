import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowUpDown,
  Target,
  Search,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
  FolderTree,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "../services/useAuth";
import { supabase } from "../services/supabaseClient"; // Ensure this is imported

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const activeUser =
    user || JSON.parse(sessionStorage.getItem("user") || "null");

  // Fetch and Listen for Alerts
  useEffect(() => {
    if (!activeUser?.id) return;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("alerts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", activeUser.id)
        .eq("is_read", false);

      if (!error) setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Realtime subscription to update the badge immediately
    const channel = supabase
      .channel("sidebar-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alerts",
          filter: `user_id=eq.${activeUser.id}`,
        },
        () => fetchUnreadCount(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeUser?.id]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-68 bg-[var(--surface)]/80 backdrop-blur-xl text-[var(--text)] flex flex-col p-6 border-r border-[var(--border)] h-screen sticky top-0 transition-all duration-300 overflow-y-auto custom-scrollbar">
      <Link
        to="/dashboard"
        className="flex items-center gap-3 text-[var(--text-h)] mb-10 px-2 flex-shrink-0 group"
      >
        <div className="bg-flow-accent p-2 rounded-xl shadow-lg shadow-flow-accent/20 transition-transform group-hover:rotate-12">
          <Zap size={20} className="text-white fill-white" />
        </div>
        <span className="font-bold text-xl tracking-tighter uppercase">
          ZeroBalance
        </span>
      </Link>

      <div className="relative mb-8 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)] opacity-40" />
        <input
          type="text"
          placeholder="Command Palette..."
          className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-xl py-2.5 pl-10 text-xs text-[var(--text-h)] focus:border-flow-accent transition-all outline-none"
        />
      </div>

      <nav className="flex-1 space-y-1">
        <SectionHeader label="Overview" />
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

        <div className="pt-8">
          <SectionHeader label="Intelligence" />
          <NavItem
            to="/budget"
            icon={<Target size={18} />}
            label="Budget Limits"
          />
          <NavItem
            to="/insights"
            icon={<TrendingUp size={18} />}
            label="Smart Insights"
          />
        </div>

        <div className="pt-8">
          <SectionHeader label="System" />
          <NavItem
            to="/alerts"
            icon={<Bell size={18} />}
            label="Alerts"
            badge={unreadCount > 0 ? unreadCount.toString() : undefined}
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

      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border)]">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${activeUser?.name || "User"}&background=6366f1&color=fff&bold=true`}
              className="w-10 h-10 rounded-xl object-cover grayscale-[0.5] hover:grayscale-0 transition-all"
              alt="user"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[var(--surface)] rounded-full"></div>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-black text-[var(--text-h)] truncate uppercase tracking-tighter">
              {activeUser?.name || "Guest User"}
            </p>
            <p className="text-[9px] truncate text-[var(--text)] opacity-60 font-bold uppercase tracking-widest">
              {activeUser?.email ? "Pro Member" : "Guest"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[var(--text)] hover:text-rose-500 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text)] opacity-30 mb-3 px-3">
    {label}
  </p>
);

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
      flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
      ${isActive ? "bg-flow-accent text-white shadow-xl shadow-flow-accent/20 translate-x-1" : "text-[var(--text)] hover:bg-white/5 hover:text-[var(--text-h)]"}
    `}
  >
    <div className="flex items-center gap-3">
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-tight">
        {label}
      </span>
    </div>
    {badge && (
      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 min-w-[18px] flex items-center justify-center rounded-full border border-white/20 animate-in zoom-in duration-300">
        {badge}
      </span>
    )}
  </NavLink>
);

export default Sidebar;
