import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import logoUrl from "../assets/logo.png";
import { useRegister } from "../services/useRegister";

const Register = ({ onToggle }: { onToggle: () => void }) => {
  const { registerUser, isLoading, error, isSuccess } = useRegister();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(formData);
  };

  return (
    <main className="flex-1 flex flex-col justify-center px-4 lg:px-20 py-12">
      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-[var(--surface)] p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-[var(--border)]">
            <CheckCircle2 size={40} className="text-flow-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[var(--text-h)] mb-3 tracking-tight">
              Success!
            </h2>
            <button
              onClick={onToggle}
              className="w-full py-4 bg-flow-button text-white rounded-sm font-bold"
            >
              Sign in now
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm mx-auto lg:mx-0">
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
          Register
        </h1>
        <p className="text-[var(--text)] text-sm mb-8 font-light">
          Join the future of financial tracking.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[var(--text)]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text)] opacity-60" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
                className="w-full pl-11 pr-4 h-[52px] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[var(--text)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text)] opacity-60" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full pl-11 pr-4 h-[52px] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-[var(--text)]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text)] opacity-60" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full pl-11 pr-4 h-[52px] bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-h)] focus:border-flow-accent outline-none transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-flow-button text-white rounded-sm font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isLoading ? (
              "Creating..."
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-sm text-center lg:text-left text-[var(--text)]">
          Already a member?{" "}
          <button
            onClick={onToggle}
            className="font-bold text-[var(--text-h)] hover:text-flow-accent transition-colors"
          >
            Log in here
          </button>
        </p>
      </div>
    </main>
  );
};

export default Register;
