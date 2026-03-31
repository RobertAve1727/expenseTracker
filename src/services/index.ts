export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface Transaction {
  id: string;
  userId: string | number;
  type: "income" | "expense"; // Unified to lowercase for easier matching
  date: string;
  amount: string;
  status: string;
  note: string;
  category: string; // Dynamic string
}

export interface Budget {
  id?: string;
  userId: string;
  masterBudget: number;
  categoryLimits: Record<string, number>; // Supports any category name
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
}
