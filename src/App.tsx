import React, { useEffect } from "react";
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

// This checks if the user is logged in before allowing them into the app
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  return (
    <div className="flex bg-white dark:bg-[#0f1115] min-h-screen transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
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

        {/* Protected Section */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Global Redirects */}
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
