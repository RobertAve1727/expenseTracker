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

// SWITCHED TO sessionStorage: This clears when the tab/window is closed
const isAuthenticated = () => {
  const user = sessionStorage.getItem("user");
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
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Theme stays in localStorage because we want the theme to persist
    // even if the user has to log back in.
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const checkAuth = () => setIsAuth(isAuthenticated());

    // We listen for the custom event to update the UI state
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/budget" element={<BudgetLimit />} />
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
