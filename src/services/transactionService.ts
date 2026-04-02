import { supabase } from "./supabaseClient";
import type { Transaction } from "./index";

export const TransactionService = {
  // 1. Fetch transactions for the user, sorted by the manual 'date'
  async getAllByUserId(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error.message);
      throw new Error(error.message);
    }
    return data as Transaction[];
  },

  // 2. Create a transaction with Status integration
  async create(formData: any, userId: string): Promise<Transaction> {
    const numericAmount = parseFloat(
      formData.amount.toString().replace(/[^\d.-]/g, ""),
    );

    if (isNaN(numericAmount)) {
      throw new Error("Invalid amount. Please enter a number.");
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId,
          type: formData.type.toLowerCase(),
          amount: numericAmount,
          category: formData.category,
          note: formData.note || "",
          date: formData.date,
          // INTEGRATION: Uses formData.status if it exists, otherwise defaults to "Completed"
          status: formData.status || "Completed",
        },
      ])
      .select()
      .single();

    if (error) {
      // If this still fails, double check that your column is lowercase 'status' in Supabase
      console.error("Supabase Insert Error:", error.message, error.details);
      throw new Error(error.message);
    }

    return data as Transaction;
  },

  // 3. Delete a transaction
  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Delete Error:", error.message);
      throw new Error(error.message);
    }
  },
};
