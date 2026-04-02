import { useState } from "react";
import { supabase } from "./supabaseClient";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const registerUser = async (formData: any) => {
    setIsLoading(true);
    setError("");

    try {
      // We pass the name inside 'options.data' so the SQL Trigger can find it
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) {
        // Handle the case where the user exists in Auth but not in Profiles
        if (authError.message.includes("already registered")) {
          setError(
            "This email is already in use. Try logging in or use a different email.",
          );
        } else {
          setError(authError.message);
        }
        return false;
      }

      if (data?.user) {
        setIsSuccess(true);
        return true;
      }

      return false;
    } catch (err) {
      setError("An unexpected error occurred during registration.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { registerUser, isLoading, error, isSuccess };
};
