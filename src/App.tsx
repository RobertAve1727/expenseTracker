import { useEffect, useState } from "react";
import {
  HashRouter as Router, // Changed from BrowserRouter to HashRouter
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { supabase } from "./services/supabaseClient";
import AuthWrapper from "./components/authWrapper";
import Dashboard from "./components/dashboard";
import TransactionPage from "./components/transaction";
import SettingsPage from "./components/settings";
import BudgetLimit from "./features/budgetLimit";
import CategoryPage from "./components/category";
import SmartInsights from "./features/smartInsights";
import Sidebar from "./components/sidebar";
import "./App.css";

// Updated: Check if local session exists
const hasLocalSession = () => {
  const user = sessionStorage.getItem("user");
  return user !== null && user !== "undefined";
};

const ProtectedRoute = () => {
  return hasLocalSession() ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  return (
    <div className="flex bg-transparent h-screen overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-white/30 dark:bg-black/10 backdrop-blur-[2px]">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const [isAuth, setIsAuth] = useState(hasLocalSession());

  useEffect(() => {
    // 1. Theme Sync
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.documentElement.classList.add("dark");

    // 2. SERVER-SIDE SESSION VALIDATION
    const validateSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      // If Supabase says no session (user deleted or expired)
      if (error || !session) {
        sessionStorage.removeItem("user");
        setIsAuth(false);
      }
    };

    validateSession();

    // 3. Auth Change Listener
    const checkAuth = () => setIsAuth(hasLocalSession());
    window.addEventListener("auth-change", checkAuth);

    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
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

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/budget" element={<BudgetLimit />} />
            <Route path="/insights" element={<SmartInsights />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

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
