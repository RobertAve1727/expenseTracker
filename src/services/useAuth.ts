import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. SYNC SESSION & VERIFICATION
  useEffect(() => {
    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        /**
         * THE FIX: GRACE PERIOD FOR HASHROUTER
         * We check window.location.hash to see if the user is currently
         * on the login or register routes.
         */
        const currentHash = window.location.hash;
        const isEntryPage =
          currentHash.includes("login") ||
          currentHash.includes("register") ||
          window.location.pathname === "/";

        if (!profile && !isEntryPage) {
          console.warn(
            "Session valid but Profile missing. Ghost session cleared.",
          );
          await logout();
          return;
        }

        const userData = {
          id: session.user.id,
          email: session.user.email,
          ...(profile || {}), // Use empty object if profile is still being created
        };

        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
      } else {
        handleLocalCleanup();
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        handleLocalCleanup();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLocalCleanup = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    // Notify App.tsx to update its state
    window.dispatchEvent(new Event("auth-change"));
  };

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
        // Strict check: Does the profile exist in the database?
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!profile || profileError) {
          await supabase.auth.signOut();
          setError("Account not found in our records.");
          return null;
        }

        const userData = {
          id: data.user.id,
          email: data.user.email,
          ...profile,
        };

        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("auth-change"));
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
    handleLocalCleanup();
  };

  return { user, verifyUser, logout, error, isLoading };
};
