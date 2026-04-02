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
      // STEP 1: Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        return false;
      }

      // STEP 2: If auth is successful, insert the name and email into your 'profiles' table
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id, // Links the Profile to the Auth account
            name: formData.fullName,
            email: formData.email,
          },
        ]);

        if (profileError) {
          setError("Account created, but profile setup failed.");
          return false;
        }

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
