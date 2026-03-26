export type Category =
  | "Food"
  | "Transport"
  | "Bills"
  | "Entertainment"
  | "Income"
  | "Custom";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO String
  type: "income" | "expense";
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}
