"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface MonthlyExpense {
  month: string;
  total: number;
}

export default function MonthlyExpensesChart() {
  const [data, setData] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessCode = localStorage.getItem("accessCode");
    if (!accessCode) {
      setError("Access code is missing.");
      setLoading(false);
      return;
    }

    async function fetchExpenses() {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const res = await axios.get("/api/buget", { params: { accessCode, month: currentMonth } });
        console.log(res.data);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching budget data:", err);
        setError("Failed to load budget data.");
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data.length) return <p className="text-gray-500">No budget data available.</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Monthly Expenses</h2>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#4F46E5" />
      </BarChart>
    </div>
  );
}
