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
      // We pass first_name and last_name inside 'options.data'
      // The SQL Trigger on your 'auth.users' table will use these to fill 'profiles'
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) {
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
