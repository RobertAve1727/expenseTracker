import { useState } from "react";
import { supabase } from "./supabaseClient"; // Your new client

export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const verifyUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      // SUPABASE SWAP: Using signInWithPassword instead of fetching users array
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (authError) {
        setError(authError.message);
        return null;
      }

      if (data?.user) {
        // We fetch the 'profile' data to get the user's name
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || "User", // Fallback if profile isn't created yet
          ...profile,
        };

        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }

      return null;
    } catch (err) {
      setError("An unexpected error occurred.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return { user, verifyUser, logout, error, isLoading };
};
