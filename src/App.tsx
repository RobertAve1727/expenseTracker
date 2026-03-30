import { useEffect } from "react";
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
import CategoryPage from "./components/category"; // [!code ++] Ensure name matches your export
import Sidebar from "./components/sidebar";
import "./App.css";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<CategoryPage />} /> // [!code
            ++]
            <Route path="/budget" element={<BudgetLimit />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Catch-all for protected routes */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            localStorage.getItem("user") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
