import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import axios from "axios";

export default function BudgetVsActualChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const month = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

  useEffect(() => {
    setAccessCode(localStorage.getItem("accessCode"));

    if (!accessCode) {
      setError("Access code is missing. Please reload the page.");
      setLoading(false);
      return;
    }

    async function fetchBudgetVsActual() {
      try {
        const res = await axios.post("/api/actual_buget", { accessCode, month })

        setData(res.data);
      } catch (err) {
        console.error("Error fetching budget vs actual:", err);
        setError("Failed to load data. Try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchBudgetVsActual();
  }, [accessCode]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold">Budget vs Actual Spending</h2>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
        <Bar dataKey="spent" fill="#ff6961" name="Spent" />
      </BarChart>
    </div>
  );
}
