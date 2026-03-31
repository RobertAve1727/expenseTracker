import type { Transaction } from "./index";

const API_URL = "http://localhost:5000/transactions";

export const TransactionService = {
  // Fetch transactions for a specific user
  async getAllByUserId(userId: string | number): Promise<Transaction[]> {
    const res = await fetch(`${API_URL}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    // Sort by date or ID reverse to show newest first
    return (data as Transaction[]).reverse();
  },

  async create(
    formData: {
      amount: string;
      type: string;
      category: string;
      note: string;
      date: string;
    },
    userId: string | number,
  ): Promise<Transaction> {
    // Standardize type to lowercase for logic, then capitalize for storage
    const typeValue = (
      formData.type.toLowerCase() === "income" ? "income" : "expense"
    ) as "income" | "expense";

    const newTransaction: Transaction = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      userId: userId,
      type: typeValue,
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      // Store raw numeric string; formatting happens in the UI layer
      amount: formData.amount,
      status: "Completed",
      note: formData.note,
      category: formData.category, // Accepts any string now
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
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete transaction");
  },
};
