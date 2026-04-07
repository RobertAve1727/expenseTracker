import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import logoUrl from "../assets/logo.png";
import { useAuth } from "../services/useAuth";

const Login = ({ onToggle }: { onToggle: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { verifyUser, error, isLoading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await verifyUser(email, password);
      if (user) navigate("/dashboard");
    } catch (err) {
      console.error("Unexpected login error:", err);
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center px-6 lg:px-20 py-[4vh] w-full h-full">
      <div className="w-full max-w-sm mx-auto lg:mx-0 flex flex-col h-full justify-between lg:justify-center">
        {/* Logo Section */}
        <div className="mb-[2vh] xl:mb-10 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 xl:w-10 xl:h-10 bg-[var(--text-h)] rounded-lg flex items-center justify-center p-2">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-full w-auto brightness-0 invert"
            />
          </div>
          <span className="text-xl xl:text-2xl font-bold tracking-tighter text-[var(--text-h)] uppercase">
            ZeroBalance
          </span>
        </div>

        {/* Header Section */}
        <div className="mb-[2vh] xl:mb-8 shrink-0">
          <h1 className="text-3xl xl:text-4xl font-semibold text-[var(--text-h)] mb-1 xl:mb-2 tracking-tight">
            Sign in
          </h1>
          <p className="text-[var(--text)] text-xs xl:text-sm font-light">
            Welcome back to your financial control center.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-[10px] font-bold text-rose-500 bg-rose-500/10 p-3 rounded-sm border border-rose-500/20 shrink-0">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form
          onSubmit={handleSignIn}
          className="space-y-[1.5vh] xl:space-y-6 flex-1 lg:flex-none"
        >
          <div className="space-y-1">
            <label className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text)] opacity-60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 h-[min(52px,6.5vh)] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all placeholder:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] xl:text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text)]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text)] opacity-60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 h-[min(52px,6.5vh)] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all placeholder:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[min(52px,7vh)] bg-flow-button text-white rounded-sm font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                Continue to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Section */}
        <p className="mt-[3vh] xl:mt-12 text-xs xl:text-sm text-center lg:text-left text-[var(--text)] shrink-0">
          Don't have an account?{" "}
          <button
            onClick={onToggle}
            className="font-bold text-[var(--text-h)] hover:text-flow-accent transition-colors"
          >
            Create Account
          </button>
        </p>
      </div>
    </main>
  );
};

export default Login;
