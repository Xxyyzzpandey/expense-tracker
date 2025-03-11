import { useState, useEffect } from "react";
import axios from "axios";

function generateAccessCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
}

export default function TransactionForm({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [transaction, setTransaction] = useState({
    amount: "",
    description: "",
    date: "",
    category:"",
  });
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [manualAccessCode, setManualAccessCode] = useState("");

  useEffect(() => {
    let storedAccessCode = localStorage.getItem("accessCode");

    if (!storedAccessCode) {
      storedAccessCode = generateAccessCode(); // Generate a new 6-letter uppercase code
      localStorage.setItem("accessCode", storedAccessCode);
    }

    setAccessCode(storedAccessCode);
  }, []);

  const handleSetAccessCode = () => {
    localStorage.setItem("accessCode", manualAccessCode);
    setAccessCode(manualAccessCode);
    setManualAccessCode(""); // Clear input
    setError(""); // Clear error if any
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!transaction.amount || !transaction.description || !transaction.date) {
      setError("All fields are required");
      return;
    }

    if (!accessCode) {
      setError("Access code is missing. Please reload the page.");
      return;
    }

    try {
      await axios.post("/api/transations", { ...transaction, accessCode });

      setTransaction({ amount: "", description: "", date: "" ,category:""});
      onTransactionAdded();
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction. Try again.");
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      {/* 🔹 Show Access Code */}
      {accessCode && (
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-gray-700 font-semibold">Your Access Code:</p>
          <p className="text-lg font-bold text-blue-600">{accessCode}</p>
          <p className="text-sm text-gray-500">Remember this code to access your records from anywhere.</p>
        </div>
      )}

      {/* 🔹 Manually Enter Access Code */}
      <div className="p-3 bg-gray-100 rounded-lg space-y-2">
        <input
          type="text"
          placeholder="Enter existing access code (6 uppercase letters)"
          value={manualAccessCode}
          onChange={(e) => setManualAccessCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSetAccessCode} className="bg-green-500 text-white p-2 rounded w-full">
          Set Access Code
        </button>
      </div>

      {/* 🔹 Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Add Transaction</h2>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="number"
          placeholder="Amount"
          value={transaction.amount}
          onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Description"
          value={transaction.description}
          onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={transaction.category}
          onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={transaction.date}
          onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Add
        </button>
      </form>
    </div>
  );
}
