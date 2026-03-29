import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  User,
  ChevronRight,
  Check,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  // Initialize state from localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Function to switch themes
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex-1 p-8 bg-white dark:bg-[#0f1115] min-h-screen font-['Rubik'] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your account preferences and application appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* APPEARANCE SECTION */}
          <section className="bg-slate-50 dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Monitor size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Appearance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <button
                onClick={() => handleThemeChange("light")}
                className={`group relative flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-200 ${
                  theme === "light"
                    ? "border-indigo-500 bg-white shadow-md"
                    : "border-transparent bg-white dark:bg-[#24272f] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl transition-colors ${theme === "light" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                >
                  <Sun size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">
                    Light Mode
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clear and bright
                  </p>
                </div>
                {theme === "light" && (
                  <div className="absolute right-6 bg-indigo-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                )}
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => handleThemeChange("dark")}
                className={`group relative flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-200 ${
                  theme === "dark"
                    ? "border-indigo-500 bg-white dark:bg-[#24272f] shadow-lg shadow-black/20"
                    : "border-transparent bg-white dark:bg-[#24272f] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl transition-colors ${theme === "dark" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                >
                  <Moon size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Easier on the eyes
                  </p>
                </div>
                {theme === "dark" && (
                  <div className="absolute right-6 bg-indigo-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* ACCOUNT & PREFERENCES (Visual Only) */}
          <section className="bg-slate-50 dark:bg-[#1a1d23] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <div className="space-y-4">
              {[
                {
                  icon: <User size={20} />,
                  label: "Profile Information",
                  sub: "Update your name and email",
                },
                {
                  icon: <Bell size={20} />,
                  label: "Notifications",
                  sub: "Manage transaction alerts",
                },
                {
                  icon: <Shield size={20} />,
                  label: "Security",
                  sub: "Change password and 2FA",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#24272f] rounded-2xl border border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400 dark:text-slate-500">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              ))}
            </div>
          </section>

          {/* CURRENCY NOTE */}
          <div className="px-8 py-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium text-center">
              System Currency is currently set to{" "}
              <strong>Philippine Peso (₱)</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
