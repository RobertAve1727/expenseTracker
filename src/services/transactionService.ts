import type { Transaction, Category } from "../types/index";

const API_URL = "http://localhost:5000/transactions";

export const TransactionService = {
  // Fetch only transactions belonging to a specific User
  async getAllByUserId(userId: string | number): Promise<Transaction[]> {
    const res = await fetch(`${API_URL}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
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
    const typeValue = (formData.type.charAt(0).toUpperCase() +
      formData.type.slice(1)) as "Income" | "Expense";

    const newTransaction: Transaction = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      userId: userId, // Links transaction to the numeric/specific user ID
      type: typeValue,
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      amount: `${typeValue === "Income" ? "+" : "-"}$${formData.amount}`,
      status: "Completed",
      note: formData.note,
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
