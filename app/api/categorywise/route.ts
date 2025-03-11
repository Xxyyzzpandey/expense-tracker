import connectDB from "../../db/dbconnect";
import {Transaction} from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  await connectDB();

  const { accessCode } = await req.json();
  if (!accessCode) return NextResponse.json({ error: "Access code required" },{status:400});

  try {
    const transactions = await Transaction.find({ accessCode });

    const totalExpenses = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    const categoryBreakdown = transactions.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {} as Record<string, number>);

    const recentTransactions = transactions.slice(0, 5);

    return NextResponse.json({ totalExpenses, categoryBreakdown, recentTransactions },{status:200});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch summary" },{status:500});
  }
}

export {handler as POST}