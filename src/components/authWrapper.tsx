import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import { Zap } from "lucide-react";

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-[var(--mesh-bg)] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl w-full h-[min(850px,92vh)] relative flex overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[var(--surface)] backdrop-blur-md">
        {/* --- THE MOVING HERO SECTION --- */}
        <aside
          className={`hidden lg:flex flex-col absolute top-0 bottom-0 w-1/2 bg-slate-800 p-[4vh] xl:p-12 z-30 transition-all duration-700 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${
            isLogin ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-flow-accent/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[80px]" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-[2vh] xl:space-y-6">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-flow-accent fill-flow-accent" />
                <span className="text-flow-accent font-black tracking-widest text-xs uppercase">
                  {isLogin ? "Welcome Back" : "Join the Movement"}
                </span>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-4xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tighter">
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
              <p className="text-slate-300 text-sm xl:text-lg max-w-md font-light">
                {isLogin
                  ? "Clarity over complexity. Access your control center."
                  : "Join users managing their expenses with ease."}
              </p>
            </div>
            <div className="relative flex-shrink aspect-[16/10] bg-slate-900/40 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
              <span className="font-handwritten text-flow-accent text-2xl xl:text-3xl">
                ZeroBalance
              </span>
            </div>
          </div>
        </aside>

        {/* --- FORM AREA --- */}
        <div className="relative w-full h-full flex z-10">
          {/* LEFT SLOT (Login) */}
          <div className="w-full lg:w-1/2 h-full relative">
            <div
              className={`absolute inset-0 w-full h-full flex transition-all duration-700 ease-in-out ${
                isLogin
                  ? "opacity-100 translate-x-0 z-20 pointer-events-auto"
                  : "opacity-0 translate-x-20 z-0 pointer-events-none"
              }`}
            >
              {/* Reset Login state too when it's hidden */}
              <Login
                key={isLogin ? "login-active" : "login-inactive"}
                onToggle={() => setIsLogin(false)}
              />
            </div>
          </div>

          {/* RIGHT SLOT (Register) */}
          <div className="w-full lg:w-1/2 h-full relative">
            <div
              className={`absolute inset-0 w-full h-full flex transition-all duration-700 ease-in-out ${
                !isLogin
                  ? "opacity-100 translate-x-0 z-20 pointer-events-auto"
                  : "opacity-0 -translate-x-20 z-0 pointer-events-none"
              }`}
            >
              {/* CRITICAL FIX: The 'key' attribute below forces React to 
                  destroy and recreate the Register component when isLogin changes.
                  This clears the success modal automatically.
              */}
              <Register
                key={isLogin ? "reg-hidden" : "reg-visible"}
                onToggle={() => setIsLogin(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
