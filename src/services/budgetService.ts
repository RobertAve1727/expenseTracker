import type { Budget } from "./index";

const API_URL = "http://localhost:5000/budgets";

export const BudgetService = {
  // Fetch budget for a specific user
  getBudgetByUserId: async (userId: string): Promise<Budget | null> => {
    try {
      const response = await fetch(`${API_URL}?userId=${userId}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error fetching budget:", error);
      return null;
    }
  },

  // Save or Update budget
  saveBudget: async (
    userId: string,
    budgetData: Omit<Budget, "userId" | "id">,
  ) => {
    const existing = await BudgetService.getBudgetByUserId(userId);

    const payload = {
      userId,
      ...budgetData,
    };

    if (existing && existing.id) {
      // Update existing
      return fetch(`${API_URL}/${existing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Create new
      return fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  },
};
