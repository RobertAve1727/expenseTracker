import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    // SWITCHED: Now checks sessionStorage on initial load
    const savedUser = sessionStorage.getItem("user");
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

        // SWITCHED: Save to sessionStorage so it clears when tab closes
        sessionStorage.setItem("user", JSON.stringify(foundUser));

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
    // SWITCHED: Clears sessionStorage
    sessionStorage.removeItem("user");
  };

  return { user, verifyUser, logout, error, isLoading };
};
