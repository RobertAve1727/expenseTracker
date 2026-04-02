import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. SYNC SESSION & LISTEN FOR CHANGES
  // This ensures the Supabase Client is actually "Authenticated" even after a refresh
  useEffect(() => {
    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Optional: Re-fetch profile here if you want the latest data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || "User",
          ...profile,
        };

        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
      } else {
        // If Supabase says there is no session, clear our local state
        setUser(null);
        sessionStorage.removeItem("user");
      }
    };

    syncSession();

    // Listen for Auth events (Login, Logout, Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        sessionStorage.removeItem("user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const verifyUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
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
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || "User",
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
