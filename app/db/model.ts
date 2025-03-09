import mongoose from "mongoose";

const categories = ["Food", "Rent", "Entertainment", "Shopping", "Bills", "Other"];

const TransactionSchema = new mongoose.Schema({
    accessCode: {
         type: String, required: true 
        }, // Unique code per user
    amount: {
         type: Number, required: true 
        },
    description: {
         type: String, required: true 
        },
    date: { 
        type: Date, required: true 
    },
    category: { 
        type: String, enum: categories, default: "Other" 
    },
  },
  { timestamps: true }
);

const BudgetSchema = new mongoose.Schema({
    accessCode: { 
        type: String, required: true
     },
    category: { 
        type: String, required: true 
    },
    amount: { 
        type: Number, required: true
     },
    month: {
         type: String, required: true 
        }, // Format: YYYY-MM (e.g., 2025-03)
  });
  
  export const Transaction =
  mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export const Budget =
  mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);