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
  password?: string;
}

export interface Transaction {
  id: string;
  userId: string | number;
  type: "Income" | "Expense";
  date: string;
  amount: string;
  status: string;
  note: string;
  category: Category;
}

export interface Budget {
  id?: string;
  userId: string;
  masterBudget: number;
  categoryLimits: {
    Food: number;
    Transport: number;
    Bills: number;
    Entertainment: number;
  };
}
