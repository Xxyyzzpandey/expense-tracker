"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#D3D3D3"];

// Type Definitions
interface SummaryData {
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
  recentTransactions: { _id: string; description: string; amount: number }[];
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [trans,settrans]=useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessCode = localStorage.getItem("accessCode");

    if (!accessCode) {
      setError("Access code is missing");
      setLoading(false);
      return;
    }

    async function fetchSummary() {
      try {
        const res = await axios.post("/api/categorywise",{accessCode})

        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
     
    async function fetchTransation(){
      try{
        const res=await axios.get("/api/transations",{
          headers: { Authorization: `Bearer ${accessCode}` },
        });
        settrans(res.data);
      }catch(err){
      console.log("error fetching transations")
      setError("Failed to fecth transations history");
    }finally {
      setLoading(false);
    }
  }
  fetchTransation();
    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!summary) return <p className="text-gray-500">No data available.</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Total Expenses */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Total Expenses</h2>
        <p className="text-2xl font-bold">₹ {summary.totalExpenses}</p>
      </div>

      {/* Category Breakdown Chart */}
      {Object.keys(summary.categoryBreakdown).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={Object.entries(summary.categoryBreakdown).map(([name, value], index) => ({
                name,
                value,
                color: COLORS[index % COLORS.length],
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {Object.keys(summary.categoryBreakdown).map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        {trans.length > 0 ? (
          <ul>
            {/* @ts-ignore */}
            {trans?.map((txn) => (
              <li key={txn._id} className="border-b py-2">
                {txn.category} - ₹{txn.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent transactions.</p>
        )}
      </div>
    </div>
  );
}
