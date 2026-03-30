import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, isLoading, error, isSuccess } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // --- THEME SYNC ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(formData);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f1115] transition-colors duration-300">
      <div className="auth-shell">
        <div className="relative min-h-screen flex p-4 lg:p-8 font-sans">
          {/* SUCCESS OVERLAY */}
          {isSuccess && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl max-w-sm w-full text-center border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-green-600 dark:text-green-400 text-4xl font-bold">
                    ✓
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-black dark:text-white mb-3">
                  All set!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                  Your account has been created successfully.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-black dark:bg-indigo-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl"
                >
                  Sign in now
                </button>
              </div>
            </div>
          )}

          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <main className="flex flex-col justify-center px-4 lg:px-20 py-12">
              <div className="w-full max-w-sm mx-auto lg:mx-0">
                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Create an account
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10">
                  Start your journey today.
                </p>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                    <p className="text-xs font-bold text-red-500">{error}</p>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-black dark:text-slate-400">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full py-3 bg-transparent border-b border-slate-300 dark:border-slate-800 focus:outline-none focus:border-black dark:focus:border-indigo-500 font-medium transition-all text-slate-900 dark:text-white"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-black dark:text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full py-3 bg-transparent border-b border-slate-300 dark:border-slate-800 focus:outline-none focus:border-black dark:focus:border-indigo-500 font-medium transition-all text-slate-900 dark:text-white"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-black dark:text-slate-400">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Create a password"
                      className="w-full py-3 bg-transparent border-b border-slate-300 dark:border-slate-800 focus:outline-none focus:border-black dark:focus:border-indigo-500 font-medium transition-all text-slate-900 dark:text-white"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-black dark:bg-indigo-600 text-white rounded-xl font-bold mt-6 hover:opacity-90 transition-all disabled:bg-slate-400 dark:disabled:bg-slate-800 shadow-lg"
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-bold text-black dark:text-white hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </main>

            <aside className="hidden lg:flex flex-col justify-center bg-black rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 text-white">
                <h2 className="text-4xl font-bold mb-4">
                  Start your journey with us.
                </h2>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  Join over 1,000+ users managing their finances with ease.
                  Clarity over complexity, every step of the way.
                </p>
              </div>
              {/* Subtle background glow to match Login side */}
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent opacity-50"></div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
