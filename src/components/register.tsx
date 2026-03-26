import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import logoUrl from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  // 1. Create state for the form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 2. Send POST request to json-server
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login"); // Redirect to login after saving
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to connect to the database.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white p-4 lg:p-8 font-sans">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <main className="flex flex-col justify-center px-4 lg:px-20 py-12">
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <h1 className="text-3xl font-bold text-black mb-2">
              Create an account
            </h1>
            <p className="text-slate-500 mb-10">
              Let's get started with your 30 day free trial.
            </p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-black">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full py-3 border-b border-slate-300 focus:outline-none focus:border-black"
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
                  className="w-full py-3 border-b border-slate-300 focus:outline-none focus:border-black"
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
                  className="w-full py-3 border-b border-slate-300 focus:outline-none focus:border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-xl font-bold mt-6"
              >
                Create account
              </button>
            </form>
          </div>
        </main>

        {/* Aside content remains the same */}
        <aside className="hidden lg:flex bg-black rounded-[40px] p-10">
          {/* ... existing sidebar code ... */}
        </aside>
      </div>
    </div>
  );
};

export default Register;
