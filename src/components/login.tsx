import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import logoUrl from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { verifyUser, error, isLoading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await verifyUser(email, password);

    if (user) {
      // Store user session (simple implementation)
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-white p-4 lg:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* 🟢 LEFT SIDE: Sign-In Form 🟢 */}
        <main className="flex flex-col justify-center px-4 lg:px-20 py-12 text-left font-semibold text-slate-800">
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            {/* Minimalist Logo */}
            <div className="mb-12 flex items-center gap-2">
              <img src={logoUrl} alt="ZeroBalance" className="h-15 w-auto" />
            </div>

            <h1 className="text-3xl font-bold text-black! mb-2">Sign in</h1>

            {/* Error Message Display */}
            {error && (
              <p className="mt-4 text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 transition-all">
                {error}
              </p>
            )}

            <form onSubmit={handleSignIn} className="mt-10 space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black">
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black">
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-black cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1A1A1A] dark:bg-black text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-bold text-slate-900 hover:underline"
                >
                  Sign up
                </button>
              </p>
              <button className="text-sm font-bold text-slate-900 text-left hover:underline">
                Forgot Password
              </button>
            </div>

            {/* Social Logins */}
            <div className="mt-10 flex items-center gap-4">
              <button className="flex-1 flex justify-center py-2.5 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                <FcGoogle size={24} />
              </button>
              <button className="flex-1 flex justify-center py-2.5 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                <FaGithub size={24} className="text-[#181717]" />
              </button>
              <button className="flex-1 flex justify-center py-2.5 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                <FaFacebook size={24} className="text-[#1877F2]" />
              </button>
            </div>
          </div>
        </main>

        {/* 🟣 RIGHT SIDE: Black Hero Card 🟣 */}
        <aside className="hidden lg:flex flex-col relative bg-black rounded-[40px] p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent opacity-50"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-64 w-auto object-contain opacity-20 mb-8 self-center"
              />

              <div className="mt-auto text-left">
                <h3 className="text-[#D8C79C] font-bold mb-4">ZeroBalance</h3>
                <h2 className="text-4xl font-bold text-[#D8C79C]! mb-4 leading-tight">
                  Welcome to ZeroBalance
                </h2>
                <p className="text-white text-sm max-w-md leading-relaxed">
                  Effortless expense tracking signed for those who value clarity
                  over complexity. Track every dollar, balance every account,
                  and find you financial peace of mind with ZeroBalance.
                </p>
              </div>
            </div>

            {/* The Inner Gray Feature Card */}
            <div className="mt-12 bg-[#2D2D2D] p-8 rounded-4xl rounded-br-[80px] relative overflow-hidden group">
              <h4 className="text-xl font-bold text-white mb-2">
                Get your right job and right place apply now
              </h4>
              <p className="text-slate-400 text-xs mb-6 max-w-xs">
                Be among the first founders to experience the easiest way to
                start and run a business.
              </p>

              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#2D2D2D] bg-slate-400 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="user"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#2D2D2D] bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                  +2
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Login;
