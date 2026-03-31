import { useEffect, useState } from "react";
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
import BudgetLimit from "./features/budgetLimit";
import CategoryPage from "./components/category";
import Sidebar from "./components/sidebar";
import "./App.css";

// Helper to check authentication status
const isAuthenticated = () => {
  const user = localStorage.getItem("user");
  // Check if user exists and isn't a string "null" or "undefined"
  return user !== null && user !== "undefined";
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  return (
    <div className="flex bg-white dark:bg-[#0f1115] h-screen overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main
        className="flex-1 h-screen overflow-y-auto 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-slate-200
        dark:[&::-webkit-scrollbar-thumb]:bg-slate-800/60
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/40
        transition-all"
      >
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  // Use state to track auth to trigger re-renders on login/logout
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Theme Logic
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Sync auth state if localStorage changes (optional but helpful)
    const checkAuth = () => setIsAuth(isAuthenticated());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes: Redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected Routes Block */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/budget" element={<BudgetLimit />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Index route for the layout */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Root Redirect Logic */}
        <Route
          path="/"
          element={
            isAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Global Catch-all */}
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
