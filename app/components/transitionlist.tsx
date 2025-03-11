import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessCode = localStorage.getItem("accessCode");
    setAccessCode(storedAccessCode);

    if (!storedAccessCode) {
      setError("Access code is missing. Please enter your access code.");
      return;
    }

    axios
    .get("/api/transations", {
      headers: { Authorization: `Bearer ${storedAccessCode}` },
    })
    .then((res) => setTransactions(res.data))
    .catch(() => setError("Failed to fetch transactions. Try again later."));
  }, []);

  const handleDelete = async (id: string) => {
    if (!accessCode) return;

    try {
      await axios.delete(`/api/transdeledit?id=${id}`, {
        headers: { Authorization: `Bearer ${accessCode}` },
      });
    // @ts-expect-error
      setTransactions((prev) => prev.filter((t) => t._id !== id));
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to delete transaction.");
    }
  };
   
  interface List{
    _id:string,
    description:string,
    amount:number,
    date:Date,
    category:string,
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Transaction List</h2>

      {accessCode && (
        <p className="text-sm text-gray-600">
          <strong>Access Code:</strong> {accessCode} (Remember this for future access)
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {transactions.length === 0 && !error && (
        <p className="text-gray-500">No transactions found.</p>
      )}

      <ul>
        {transactions.map((txn:List) => (
          <li key={txn._id} className="flex justify-between items-center border-b py-2">
            <div>
              <p>{txn.category} - ${txn.amount}</p>
              <small className="text-gray-500">{new Date(txn.date).toLocaleDateString()}</small>
            </div>
            <button onClick={() => handleDelete(txn._id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
