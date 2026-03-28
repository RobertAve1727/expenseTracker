// 1. Added Category to the type-only import
import type { Transaction, Category } from "../types/index";

const API_URL = "http://localhost:5000/transactions";

export const TransactionService = {
  async getAll(): Promise<Transaction[]> {
    const res = await fetch(API_URL);
    const data = await res.json();
    return (data as Transaction[]).reverse();
  },

  async create(formData: {
    amount: string;
    type: string;
    category: string;
    note: string;
    date: string;
  }): Promise<Transaction> {
    // 2. Explicitly cast to the union "Income" | "Expense"
    const typeValue = (formData.type.charAt(0).toUpperCase() +
      formData.type.slice(1)) as "Income" | "Expense";

    const newTransaction: Transaction = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      type: typeValue, // This matches your Interface
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      // amount is a string in your index.ts, so this is valid
      amount: `${typeValue === "Income" ? "+" : "-"}$${formData.amount}`,
      status: "Completed",
      note: formData.note,
      // 3. CRITICAL: Cast the string to the Category type
      category: formData.category as Category,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    });

    if (!res.ok) throw new Error("Failed to create transaction");

    return (await res.json()) as Transaction;
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};
