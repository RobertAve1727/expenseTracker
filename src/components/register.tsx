import React, { useState } from "react";
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Stop event bubbling to ensure no parent triggers a reload
    e.stopPropagation();
    await registerUser(formData);
  };

  return (
    <div className="relative min-h-screen flex bg-white p-4 lg:p-8 font-sans">
      {/* 🟠 SUCCESS OVERLAY MODAL 🟠 */}
      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-sm w-full text-center border border-slate-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-600 text-4xl font-bold">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-black mb-3">All set!</h2>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              Your account was created successfully. Ready to manage your
              balance?
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-xl"
            >
              Sign in now
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <main className="flex flex-col justify-center px-4 lg:px-20 py-12 text-left font-semibold text-slate-800">
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <h1 className="text-3xl font-bold text-black! mb-2">
              Create an account
            </h1>
            <p className="text-slate-500 mb-10 font-normal">
              Let's get started with your 30 day free trial.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-bold text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-black">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full py-3 border-b border-slate-300 focus:outline-none focus:border-black font-medium transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-black">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full py-3 border-b border-slate-300 focus:outline-none focus:border-black font-medium transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-black">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  className="w-full py-3 border-b border-slate-300 focus:outline-none focus:border-black font-medium transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-black text-white rounded-xl font-bold mt-6 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:bg-slate-400"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-500 font-normal">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-bold text-black hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </main>

        <aside className="hidden lg:flex bg-black rounded-[40px] p-10 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent opacity-50"></div>
          <div className="relative z-10 flex flex-col justify-center text-white">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Start your journey with us.
            </h2>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed font-normal">
              Join over 1,000+ users managing their finances with ease.
              Effortless expense tracking designed for clarity.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Register;
