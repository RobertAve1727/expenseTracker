import { useEffect, useState } from "react";
import {
  HashRouter as Router,
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
import Alerts from "./features/alerts";
import Sidebar from "./components/sidebar";
import Support from "./components/support"; // Import your new Support component
import "./index.css";

const hasLocalSession = () => {
  const user = sessionStorage.getItem("user");
  return user !== null && user !== "undefined";
};

const ProtectedRoute = () => {
  return hasLocalSession() ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  return (
    <div className="flex bg-transparent min-h-screen w-full overflow-hidden transition-colors duration-300">
      <div className="flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-screen overflow-y-auto bg-white/30 dark:bg-black/10 backdrop-blur-[2px] custom-scrollbar">
        <div className="max-w-[1600px] mx-auto w-full p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function App() {
  const [isAuth, setIsAuth] = useState(hasLocalSession());

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.documentElement.classList.add("dark");

    const validateSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        sessionStorage.removeItem("user");
        setIsAuth(false);
      }
    };

    validateSession();

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
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<Support />} />{" "}
            {/* New Support Route */}
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
