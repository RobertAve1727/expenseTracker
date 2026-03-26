import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register"; // New component
import Dashboard from "./components/dashboard"; // New component
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect empty path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Application Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all: redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
