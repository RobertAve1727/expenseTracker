import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AuthWrapper from "./components/authWrapper"; // New consolidated component
import Dashboard from "./components/dashboard";
import TransactionPage from "./components/transaction";
import SettingsPage from "./components/settings";
import BudgetLimit from "./features/budgetLimit";
import CategoryPage from "./components/category";
import SmartInsights from "./features/smartInsights";
import Sidebar from "./components/sidebar";
import "./App.css";

// Check if user session exists
const isAuthenticated = () => {
  const user = sessionStorage.getItem("user");
  return user !== null && user !== "undefined";
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  return (
    <div className="flex bg-transparent h-screen overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main
        className="flex-1 h-screen overflow-y-auto 
        bg-white/30 dark:bg-black/10 backdrop-blur-[2px]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-slate-200/50
        dark:[&::-webkit-scrollbar-thumb]:bg-slate-800/40
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-flow-accent/40
        transition-all"
      >
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Sync Theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Sync Auth State across the app
    const checkAuth = () => setIsAuth(isAuthenticated());
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Both Login and Register now use AuthWrapper for the sliding effect */}
        <Route
          path="/login"
          element={
            isAuth ? <Navigate to="/dashboard" replace /> : <AuthWrapper />
          }
        />
        <Route
          path="/register"
          element={
            isAuth ? <Navigate to="/dashboard" replace /> : <AuthWrapper />
          }
        />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/budget" element={<BudgetLimit />} />
            <Route path="/insights" element={<SmartInsights />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route
              path="/alerts"
              element={
                <div className="p-10 text-[var(--text-h)] font-black uppercase tracking-widest opacity-40">
                  Alerts Coming Soon
                </div>
              }
            />
            <Route
              path="/support"
              element={
                <div className="p-10 text-[var(--text-h)] font-black uppercase tracking-widest opacity-40">
                  Support Coming Soon
                </div>
              }
            />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Global Redirects */}
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

        <Route
          path="*"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
