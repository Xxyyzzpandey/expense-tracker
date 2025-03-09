import connectDB from "../../db/dbconnect";
import {Transaction} from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

 async function handler(req: NextRequest, res: NextResponse) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { accessCode, amount, description, date, category } = await req.json();

      if (!accessCode || !amount || !description || !date) {
        return NextResponse.json({ error: "All fields are required" },{status:400});
      }
      const newTransaction = new Transaction({ accessCode, amount, description, date, category });
      await newTransaction.save();
      console.log("it is not printing ");
      return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to add transaction" },{status:500});
    }
  }

  if (req.method === "GET") {
    try {
        const authHeader = req.headers.get("Authorization");
        const accessCode = authHeader?.split("Bearer ")[1];

      if (!accessCode || typeof accessCode !== "string") {
        return NextResponse.json({ error: "Access code is required" },{status:400});
      }

      const transactions = await Transaction.find({ accessCode }).sort({ date: -1 });
      return NextResponse.json(transactions,{status:201});
    } catch (error) {
        return NextResponse.json({ error: "Failed to get transaction" },{status:500});
    }
  }

  NextResponse.json("only get and post method is allowed",{status:500});
}

export {handler as POST}
export {handler as GET}