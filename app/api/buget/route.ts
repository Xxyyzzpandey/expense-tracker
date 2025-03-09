
import connectDB from "../../db/dbconnect";
import {Budget} from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

 async function handler(req: NextRequest, res: NextResponse) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { accessCode, category, amount, month } = await req.json();

      if (!accessCode || !category || !amount || !month) {
        return NextResponse.json({ error: "All fields are required" },{status:400});
      }

      const budget = await Budget.findOneAndUpdate(
        { accessCode, category, month },
        { amount },
        { upsert: true, new: true }
      );

      return NextResponse.json(budget,{status:200});
    } catch (error) {
      return NextResponse.json({ error: "Failed to set budget" },{status:500});
    }
  }

  if (req.method === "GET") {
    try {
      const { accessCode, month } = await req.json();

      if (!accessCode || !month) return NextResponse.json({ error: "Access code and month required" },{status:400});

      const budgets = await Budget.find({ accessCode, month });
      return NextResponse.json(budgets,{status:200});
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch budgets" },{status:500});
    }
  }

  NextResponse.json({ error: `Method ${req.method} Not Allowed` },{status:405});
}
export {handler as POST}
export {handler as GET}