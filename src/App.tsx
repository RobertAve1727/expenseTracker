import React, { useEffect } from "react"; // Added useEffect
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import TransactionPage from "./components/transaction";
import SettingsPage from "./components/settings";
import Sidebar from "./components/sidebar";
import "./App.css";

// Layout for pages that REQUIRE the Sidebar
const AppLayout = () => {
  return (
    /* Updated background classes to support theme switching */
    <div className="flex bg-white dark:bg-[#0f1115] min-h-screen transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  // --- THEME PERSISTENCE LOGIC ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth Routes (No Sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes (With Sidebar) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Default dashboard as index */}
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Global Redirects */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
