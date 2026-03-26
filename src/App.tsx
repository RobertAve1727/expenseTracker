import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login"; // Make sure the filename matches your Login file
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route shows Login */}
        <Route path="/login" element={<Login />} />

        {/* Redirect empty path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Placeholder for future routes */}
        <Route
          path="/register"
          element={<div>Register Page (Coming Soon)</div>}
        />
        <Route
          path="/dashboard"
          element={<div>Dashboard Page (Coming Soon)</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
