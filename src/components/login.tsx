import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Apple, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import logoUrl from "../assets/zerobalance-logo.png";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing in...");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#5f6f76] font-sans">
      {/* 🟢 LEFT SIDE */}
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <img src={logoUrl} alt="logo" className="h-10 mb-6 opacity-80" />

          <h1 className="text-4xl font-semibold text-white mb-10">Sign in</h1>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs text-[#e5d3a3]">Username</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-white/70 focus:bg-white transition outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs text-[#e5d3a3]">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-white/70 focus:bg-white transition outline-none"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 text-xs text-[#e5d3a3]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </div>

            {/* Button */}
            <button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90">
              Sign in <LogIn size={18} />
            </button>

            {/* Links */}
            <div className="text-xs text-[#e5d3a3] text-left">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="underline cursor-pointer"
              >
                Sign Up
              </span>
              <br />
              <span className="underline cursor-pointer">Forgot Password</span>
            </div>
          </form>

          {/* Social Icons */}
          <div className="flex gap-6 mt-10 justify-center">
            <FcGoogle size={28} />
            <FaFacebook size={28} className="text-blue-600" />
            <Apple size={28} />
          </div>
        </div>
      </div>

      {/* 🟣 RIGHT SIDE */}
      <div className="flex items-start justify-center pt-0 px-10 pb-10">
        <div className="w-full max-w-lg bg-linear-to-br from-black via-[#1a1a1a] to-black text-[#e5d3a3] rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white,transparent)]"></div>

          {/* Logo */}
          <img src={logoUrl} className="h-24 mb-6 mx-auto" />

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Welcome to ZeroBalance
          </h2>

          <p className="text-sm text-center text-[#cfc3a0] mb-10 px-4">
            Effortless expense tracking designed for clarity over complexity.
            Track every dollar, balance every account, and find your financial
            peace of mind.
          </p>

          {/* Bottom Card */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md max-w-md mx-auto">
            <h3 className="font-semibold mb-2 text-center">
              Know where your money disappears
            </h3>
            <p className="text-sm text-[#cfc3a0] text-center">
              Be among the first to experience the easiest way to achieve
              financial clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
