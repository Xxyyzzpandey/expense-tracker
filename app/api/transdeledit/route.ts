import connectDB from "../../db/dbconnect";
import { Transaction } from "../../db/model";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { id, accessCode, ...updateData } = await req.json();

      if (!id) return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
      if (!accessCode) return NextResponse.json({ error: "Access code is required" }, { status: 400 });

      const transaction = await Transaction.findOne({ _id: id, accessCode });

      if (!transaction) return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 });

      const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });
      return NextResponse.json(updatedTransaction, { status: 200 });
    } catch (error) {
      console.error("Error updating transaction:", error);
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      // Extract `id` from the URL params
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      // Extract `accessCode` from the Authorization header
      const authHeader = req.headers.get("Authorization");
      const accessCode = authHeader?.split("Bearer ")[1];

      if (!id) return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
      if (!accessCode) return NextResponse.json({ error: "Access code is required" }, { status: 400 });

      // Find the transaction
      const transaction = await Transaction.findOne({ _id: id, accessCode });

      if (!transaction) return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 });

      // Delete the transaction
      await Transaction.findByIdAndDelete(id);

      return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
}

export { handler as POST };
export { handler as DELETE };
