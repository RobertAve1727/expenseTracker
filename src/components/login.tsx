import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Sun, Moon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import logoUrl from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();
  const { verifyUser, error, isLoading } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await verifyUser(email, password);
    if (user) {
      // SAVE TO SESSION STORAGE: This ensures the login is forgotten when the tab closes
      sessionStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("auth-change"));
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f1115] transition-colors duration-300">
      <div className="auth-shell relative">
        <button
          onClick={toggleTheme}
          className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all z-50 shadow-sm"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="min-h-screen flex p-4 lg:p-8 font-sans transition-colors duration-300">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <main className="flex flex-col justify-center px-4 lg:px-20 py-12 text-left font-semibold text-slate-800 dark:text-slate-200">
              <div className="w-full max-w-sm mx-auto lg:mx-0">
                <div className="mb-12 flex items-center gap-2">
                  <img
                    src={logoUrl}
                    alt="ZeroBalance"
                    className="h-15 w-auto"
                  />
                </div>

                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Sign in
                </h1>

                {error && (
                  <div className="mt-4 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignIn} className="mt-10 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-slate-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johndoe@gmail.com"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#1A1A1A] dark:bg-indigo-600 text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex justify-center items-center"
                  >
                    {isLoading ? "Verifying..." : "Sign in"}
                  </button>
                </form>

                <div className="mt-6 flex flex-col gap-2">
                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <button
                      onClick={() => navigate("/register")}
                      className="font-bold text-slate-900 dark:text-white hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <button className="flex-1 flex justify-center py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                    <FcGoogle size={24} />
                  </button>
                  <button className="flex-1 flex justify-center py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                    <FaGithub
                      size={24}
                      className="text-[#181717] dark:text-white"
                    />
                  </button>
                  <button className="flex-1 flex justify-center py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                    <FaFacebook size={24} className="text-[#1877F2]" />
                  </button>
                </div>
              </div>
            </main>

            <aside className="hidden lg:flex flex-col relative bg-black rounded-[40px] p-10 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent opacity-50"></div>
              <div className="relative z-10 h-full flex flex-col text-white">
                <div className="flex-1 flex flex-col justify-center">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-64 w-auto object-contain opacity-20 mb-8 self-center"
                  />
                  <div className="mt-auto text-left">
                    <h3 className="text-[#D8C79C] font-bold mb-4">
                      ZeroBalance
                    </h3>
                    <h2 className="text-4xl font-bold text-[#D8C79C] mb-4 leading-tight">
                      Welcome to ZeroBalance
                    </h2>
                    <p className="text-white text-sm max-w-md leading-relaxed">
                      Effortless expense tracking designed for those who value
                      clarity over complexity.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
