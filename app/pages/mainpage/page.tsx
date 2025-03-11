"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TransactionForm from "../../components/addeditform";
import TransactionList from "../../components/transitionlist";
import Navbar from "@/app/components/navbar";

// Dynamically import Recharts component (Client-Only)
const MonthlyExpensesChart = dynamic(() => import("../../components/monthlychart"), { ssr: false });

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  return (<>
    <Navbar/>
    <div className="p-4 space-y-4">
      
      <TransactionForm onTransactionAdded={() => setRefresh((prev) => !prev)} />
      {/* @ts-ignore */}
      <TransactionList refresh={refresh} />
      {/* @ts-ignore */}
      <MonthlyExpensesChart refresh={refresh} />
    </div>
    </>
  );
}
