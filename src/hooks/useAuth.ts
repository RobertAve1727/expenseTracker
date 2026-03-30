import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const verifyUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      // Fetching your local users array
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password,
      );

      if (foundUser) {
        setUser(foundUser);
        // Using the original "user" key
        localStorage.setItem("user", JSON.stringify(foundUser));
        return foundUser;
      }

      setError("Invalid email or password.");
      return null;
    } catch (err) {
      setError("Server connection failed.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, verifyUser, logout, error, isLoading };
};
