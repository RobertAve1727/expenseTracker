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
    <div className="flex-1 p-8 lg:p-12 bg-[var(--bg)] min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-5xl font-black text-[var(--text-h)] tracking-tighter">
            Settings
          </h1>
          <p className="text-[var(--text)] text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-40">
            Manage your account preferences and application appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* APPEARANCE SECTION */}
          <section className="bg-[#b3b3b3]/90 backdrop-blur-2xl border border-white/20 rounded-[3.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-[var(--flow-accent)] text-white rounded-2xl shadow-lg shadow-[var(--flow-accent)]/20">
                <Monitor size={22} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tighter">
                Appearance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Mode Card */}
              {/* Light Mode Card */}
              <button
                onClick={() => handleThemeChange("light")}
                className={`group relative flex items-center gap-6 p-8 rounded-[2rem] border-4 transition-all duration-300 ${
                  theme === "light"
                    ? "border-[var(--flow-accent)] bg-white shadow-xl scale-[1.02]"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-slate-500"
                }`}
              >
                <div
                  className={`p-5 rounded-2xl transition-all ${
                    theme === "light"
                      ? "bg-[var(--flow-accent)] text-[#1a1a1a] rotate-12 shadow-lg shadow-[var(--flow-accent)]/20"
                      : "bg-white/50 text-slate-400"
                  }`}
                >
                  <Sun size={28} strokeWidth={3} />
                </div>
                <div className="text-left">
                  <p
                    className={`font-black uppercase text-xs tracking-widest ${theme === "light" ? "text-black" : "text-slate-600"}`}
                  >
                    Light Mode
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">
                    Clear and bright
                  </p>
                </div>
                {theme === "light" && (
                  <div className="absolute right-8 bg-[var(--flow-accent)] text-[#1a1a1a] p-1.5 rounded-full shadow-lg border-2 border-white/20">
                    <Check size={16} strokeWidth={4} />
                  </div>
                )}
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => handleThemeChange("dark")}
                className={`group relative flex items-center gap-6 p-8 rounded-[2rem] border-4 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-[var(--flow-accent)] bg-[#1a1d23] shadow-2xl scale-[1.02]"
                    : "border-transparent bg-white/40 hover:bg-white/60 text-slate-500"
                }`}
              >
                <div
                  className={`p-5 rounded-2xl transition-all ${
                    theme === "dark"
                      ? "bg-[var(--flow-accent)] text-[#1a1a1a] rotate-12 shadow-lg shadow-[var(--flow-accent)]/20"
                      : "bg-black/50 text-slate-400"
                  }`}
                >
                  <Moon size={28} strokeWidth={3} />
                </div>
                <div className="text-left">
                  <p
                    className={`font-black uppercase text-xs tracking-widest ${theme === "dark" ? "text-white" : "text-slate-600"}`}
                  >
                    Dark Mode
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">
                    Easier on the eyes
                  </p>
                </div>
                {theme === "dark" && (
                  <div className="absolute right-8 bg-[var(--flow-accent)] text-[#1a1a1a] p-1.5 rounded-full shadow-lg border-2 border-white/10">
                    <Check size={16} strokeWidth={4} />
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* ACCOUNT & PREFERENCES */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[3.5rem] p-10 backdrop-blur-xl">
            <div className="space-y-4">
              {[
                {
                  icon: <User size={22} />,
                  label: "Profile Information",
                  sub: "Update your name and email",
                },
                {
                  icon: <Bell size={22} />,
                  label: "Notifications",
                  sub: "Manage transaction alerts",
                },
                {
                  icon: <Shield size={22} />,
                  label: "Security",
                  sub: "Change password and 2FA",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-6 bg-white/5 dark:bg-black/20 rounded-[2rem] border border-white/5 opacity-40 cursor-not-allowed group transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-slate-400 group-hover:text-[var(--flow-accent)] transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-widest text-[var(--text-h)]">
                        {item.label}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-slate-600"
                    strokeWidth={3}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* CURRENCY NOTE */}
          <div className="px-10 py-6 bg-[var(--flow-accent)]/10 border border-[var(--flow-accent)]/20 rounded-[2rem] backdrop-blur-md">
            <p className="text-[10px] text-[var(--flow-accent)] font-black uppercase tracking-[0.4em] text-center">
              System Currency is currently set to{" "}
              <strong className="text-[var(--text-h)] underline decoration-[var(--flow-accent)]/30 underline-offset-4">
                Philippine Peso (₱)
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
