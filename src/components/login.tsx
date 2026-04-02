import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import logoUrl from "../assets/logo.png";
import { useAuth } from "../services/useAuth";

const Login = ({ onToggle }: { onToggle: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // verifyUser should be calling supabase.auth.signInWithPassword
  // and returning the user object or null
  const { verifyUser, error, isLoading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await verifyUser(email, password);

      if (user) {
        // 1. Store the user data locally
        sessionStorage.setItem("user", JSON.stringify(user));

        // 2. Trigger the custom event so App.tsx knows isAuth is now true
        window.dispatchEvent(new Event("auth-change"));

        // 3. Redirect to the dashboard
        navigate("/dashboard");
      } else {
        // If verifyUser returns null, it means the account doesn't exist
        // or the credentials were wrong. The 'error' from useAuth
        // will display in the UI below.
        console.error(
          "Login failed: Account may have been deleted or invalid credentials.",
        );
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center px-4 lg:px-20 py-12">
      <div className="w-full max-w-sm mx-auto lg:mx-0">
        {/* Logo Section */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--text-h)] rounded-lg flex items-center justify-center p-2">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-full w-auto brightness-0 invert"
            />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-[var(--text-h)] uppercase">
            ZeroBalance
          </span>
        </div>

        <h1 className="text-4xl font-semibold text-[var(--text-h)] mb-2 tracking-tight">
          Sign in
        </h1>
        <p className="text-[var(--text)] text-sm mb-8 font-light">
          Welcome back to your financial control center.
        </p>

        {/* Error Feedback */}
        {error && (
          <div className="mt-4 text-xs font-bold text-rose-500 bg-rose-500/10 p-4 rounded-sm border border-rose-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text)]">
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
                className="w-full pl-11 pr-4 h-[52px] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all placeholder:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text)]">
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
                className="w-full pl-11 pr-4 h-[52px] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all placeholder:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-flow-button text-white rounded-sm font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="mt-12 text-sm text-center lg:text-left text-[var(--text)]">
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
