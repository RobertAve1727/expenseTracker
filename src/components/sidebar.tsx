import React from "react";
import {
  LayoutDashboard,
  Compass,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  Search,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#111111] text-slate-400 flex flex-col p-6 border-r border-slate-800 h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 text-white mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin-slow"></div>
        </div>
        <span className="font-bold text-xl tracking-tight">ZeroBalance</span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[#1A1A1A] border-none rounded-lg py-2 pl-10 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4 px-2">
          Main Menu
        </p>

        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active
        />
        <NavItem icon={<Compass size={18} />} label="Discovery" />
        <NavItem icon={<FileText size={18} />} label="Reports" />
        <NavItem icon={<Settings size={18} />} label="Settings" />
        <NavItem icon={<HelpCircle size={18} />} label="Help" />
      </nav>

      {/* Secondary Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between px-2 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Templates
          </p>
          <Plus
            size={14}
            className="cursor-pointer hover:text-white transition-colors"
          />
        </div>
        <div className="space-y-3 px-2 text-sm">
          <button className="flex items-center gap-2 hover:text-white transition-colors w-full text-left">
            <div className="w-2 h-2 rounded-sm bg-blue-500"></div> Monthly
            revenues
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors w-full text-left">
            <div className="w-2 h-2 rounded-sm bg-purple-500"></div> Extreme
            forecast
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-auto flex items-center gap-3 p-2 border-t border-slate-800 pt-6">
        <img
          src="https://i.pravatar.cc/100?img=12"
          className="w-10 h-10 rounded-full border border-slate-700"
          alt="user"
        />
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-bold text-white truncate">Capital M</p>
          <p className="text-[10px] truncate text-slate-500">
            chris@capitalm.co
          </p>
        </div>
        <button className="hover:text-red-400 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${active ? "bg-blue-600 text-white" : "hover:bg-[#1A1A1A] hover:text-white"}`}
  >
    <span
      className={
        active ? "text-white" : "group-hover:text-blue-400 transition-colors"
      }
    >
      {icon}
    </span>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Sidebar;
