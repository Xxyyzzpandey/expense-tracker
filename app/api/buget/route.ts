import connectDB from "../../db/dbconnect";
import { Budget } from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  
  try {
    const { category,accessCode, month, amount } = await req.json();

    if (!accessCode || !month || !amount) {
      return NextResponse.json({ error: "Access code, month, and amount are required" }, { status: 400 });
    }

    const budget = new Budget({ category,accessCode, month, amount });
    await budget.save();

    return NextResponse.json({ message: "Budget set successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error setting budget:", error);
    return NextResponse.json({ error: "Failed to set budget" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  function formatMonth(isoMonth: string): string {
    const [year, month] = isoMonth.split("-").map(Number);
    return new Date(year, month - 1).toLocaleString("en-US", { month: "long" });
}

  try {
    const { searchParams } = new URL(req.url);
    const accessCode = searchParams.get("accessCode");
    const month = searchParams.get("month");

    if (!accessCode || !month) {
      return NextResponse.json({ error: "Access code and month required" }, { status: 400 });
    }

    // Ensure month filtering is correct
    const budgets = await Budget.find({ accessCode, month });

    const formattedBudgets = budgets.map(budget => ({
      month: formatMonth(budget.month), // Convert "2025-03" to "March"
      total: budget.total
    }));
    
    return NextResponse.json(formattedBudgets, { status: 200 });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}
