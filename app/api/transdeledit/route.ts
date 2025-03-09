import connectDB from "../../db/dbconnect";
import {Transaction} from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

 async function handler(req: NextRequest, res: NextResponse) {
  await connectDB();
  const { id } = await req.json();

  if (req.method === "POST") {
    try {
      const { accessCode, ...updateData } =await req.json();

      if (!accessCode) return NextResponse.json({ error: "Access code is required" },{status:400});

      const transaction = await Transaction.findOne({ _id: id, accessCode });

    if (!transaction) return NextResponse.json({ error: "Transaction not found or unauthorized" },{status:404});

      const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });
      return NextResponse.json(updatedTransaction,{status:200});
    } catch (error) {
      return NextResponse.json({ error: "Failed to update transaction" },{status:500});
    }
  }

  if (req.method === "DELETE") {
    try {
      const { accessCode } = await req.json();

      if (!accessCode) return NextResponse.json({ error: "Access code is required" },{status:400});

      const transaction = await Transaction.findOne({ _id: id, accessCode });

      if (!transaction) return NextResponse.json({ error: "Transaction not found or unauthorized" },{status:400});

      await Transaction.findByIdAndDelete(id);
      return NextResponse.json({ message: "Transaction deleted" },{status:200});
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete transaction" },{status:500});
    }
  }
  NextResponse.json(`Method ${req.method} Not Allowed`,{status:405});
}

export {handler as POST}
export {handler as DELETE}