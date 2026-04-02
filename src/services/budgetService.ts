import { supabase } from "./supabaseClient";
import type { Budget } from "./index";

export const BudgetService = {
  // Fetch budget for a specific user
  getBudgetByUserId: async (userId: string): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching budget:", error);
      return null;
    }
  },

  // Save or Update budget
  saveBudget: async (
    userId: string,
    budgetData: {
      masterBudget: number;
      categoryLimits: Record<string, number>;
    },
  ) => {
    try {
      // Mapping camelCase from UI to snake_case for Supabase
      const { data, error } = await supabase.from("budgets").upsert(
        {
          user_id: userId,
          master_budget: budgetData.masterBudget,
          category_limits: budgetData.categoryLimits,
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving budget:", error);
      throw error;
    }
  },
};
