import React, { useEffect, useState } from "react";
import { addExpense, listenExpenses, deleteExpense } from "./expenseService";

function App() {
  const [expenses, setExpenses] = useState([]);

  const user = { uid: "demo-user-123" }; // replace with auth later

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: ""
  });

  // REAL-TIME LOAD
  useEffect(() => {
    const unsub = listenExpenses(user.uid, setExpenses);
    return () => unsub();
  }, []);

  // ADD EXPENSE
  const handleAdd = async () => {
    if (!form.title || !form.amount) return;

    await addExpense(form, user.uid);

    setForm({ title: "", amount: "", category: "" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💰 Expense Tracker V2</h2>

      {/* INPUTS */}
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <br />

      <input
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />
      <br />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <br />

      <button onClick={handleAdd}>Add Expense</button>

      <hr />

      {/* LIST */}
      {expenses.map((exp) => (
        <div key={exp.id} style={{ marginBottom: 10 }}>
          <b>{exp.title}</b> — ₦{exp.amount} ({exp.category})

          <button
            style={{ marginLeft: 10 }}
            onClick={() => deleteExpense(exp.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
