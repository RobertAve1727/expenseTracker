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
  userId: string | number; // <--- ADD THIS LINE
  type: "Income" | "Expense";
  date: string;
  amount: string;
  status: string;
  note: string;
  category: Category;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}
