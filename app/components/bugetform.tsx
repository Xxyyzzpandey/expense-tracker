
"use client"

import { useState, useEffect } from "react";
import axios from "axios";

export default function BudgetForm() {
  const [budget, setBudget] = useState({
    category: "",
    amount: 0,
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  });
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    setAccessCode(localStorage.getItem("accessCode")); // Ensure localStorage is accessed in useEffect
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessCode) {
      alert("Access code is missing. Please reload the page.");
      return;
    }

    try {
      await axios.post("/api/buget", { ...budget, accessCode });
      alert("Budget saved!");
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-white shadow rounded-lg">
      <select
        value={budget.category}
        onChange={(e) => setBudget({ ...budget, category: e.target.value })}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Rent">Rent</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={budget.amount}
        onChange={(e) => setBudget({ ...budget, amount: Number(e.target.value) })}
        required
        className="border p-2 rounded w-full"
      />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Save Budget
      </button>
    </form>
  );
}
