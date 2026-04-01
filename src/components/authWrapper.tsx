import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import { Zap } from "lucide-react";

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl w-full h-[850px] relative grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[var(--surface)] backdrop-blur-md">
        {/* --- THE MOVING HERO SECTION --- */}
        <aside
          className={`hidden lg:flex flex-col absolute top-0 bottom-0 w-1/2 bg-slate-800 p-12 z-20 transition-all duration-700 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${
            isLogin ? "left-1/2" : "left-0"
          }`}
        >
          {/* Internal Mesh Texture */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-flow-accent/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[80px]" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-flow-accent fill-flow-accent" />
                <span className="text-flow-accent font-black tracking-widest text-xs uppercase">
                  {isLogin ? "Welcome Back" : "Join the Movement"}
                </span>
              </div>

              <div className="overflow-hidden">
                <h2 className="text-6xl font-bold text-white leading-[1.05] tracking-tighter">
                  {isLogin ? (
                    <div className="animate-in slide-in-from-bottom-8 duration-500">
                      Control your <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-flow-accent">
                        Balance
                      </span>
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-8 duration-500">
                      Start your <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-flow-accent">
                        Journey
                      </span>
                    </div>
                  )}
                </h2>
              </div>

              <p className="text-slate-300 text-lg max-w-md font-light leading-relaxed">
                {isLogin
                  ? "Clarity over complexity. Access your financial control center."
                  : "Join over 1,000+ users managing their expenses with ease."}
              </p>
            </div>

            {/* Abstract Visual Core */}
            <div className="relative aspect-[16/10] bg-slate-900/40 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden group">
              <div className="relative flex flex-col items-center">
                <div className="w-40 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent relative">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-in-out ${isLogin ? "left-3/4" : "left-1/4"}`}
                  />
                </div>
                <div className="flex gap-3 mt-12">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-8 bg-white/10 rounded-full transition-all duration-700 ${isLogin ? "scale-y-125 bg-flow-accent/40" : "scale-y-75"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="w-8 h-[1px] bg-white/30" />
                <span className="font-handwritten text-flow-accent text-3xl">
                  ZeroBalance
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* --- THE FORMS --- */}
        <div
          className={`w-full flex transition-all duration-700 ${isLogin ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`}
        >
          <Login onToggle={() => setIsLogin(false)} />
        </div>

        <div
          className={`w-full flex transition-all duration-700 ${!isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}`}
        >
          <Register onToggle={() => setIsLogin(true)} />
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
