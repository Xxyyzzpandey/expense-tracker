
import connectDB from "../../db/dbconnect";
import {Transaction} from "../../db/model";
import {Budget} from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

 async function handler(req: NextRequest) {
  await connectDB();
  
  const { accessCode, month } = await req.json();
  if (!accessCode || !month) return NextResponse.json({ error: "Access code and month required" },{status:400});

  try {
    const transactions = await Transaction.find({
      accessCode,
      date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) },
    });

    const budgets = await Budget.find({ accessCode, month });

    const spendingByCategory = transactions.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {} as Record<string, number>);

    const budgetComparison = budgets.map(budget => ({
      category: budget.category,
      budget: budget.amount,
      spent: spendingByCategory[budget.category] || 0,
    }));

    NextResponse.json(budgetComparison,{status:200});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" },{status:500});
  }
}

export {handler as POST}