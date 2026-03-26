// hooks/useAuth.ts
import { useState } from "react";

export const useAuth = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const verifyUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const user = users.find(
        (u: any) => u.email === email && u.password === password,
      );

      if (user) return user;

      setError("Invalid email or password.");
      return null;
    } catch (err) {
      setError("Server connection failed.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyUser, error, isLoading };
};
