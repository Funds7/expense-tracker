import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const form = document.getElementById("form");

let total = 0;

// 🔥 REAL-TIME LISTENER
const q = query(collection(db, "expenses"), orderBy("date", "desc"));

onSnapshot(q, (snapshot) => {
  list.innerHTML = "";
  total = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // calculate balance
    snapshot.forEach((docSnap) => {
  const data = docSnap.data();

  const value = Number(data.amount) || 0;
  const type = (data.type || "").toLowerCase();

  if (type === "expense") {
    total -= value;
  } else {
    total += value;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    ${data.title} - ₦${value}
    <button onclick="deleteExpense('${docSnap.id}')">X</button>
  `;

  list.appendChild(li);
});

  balanceEl.innerText = "Balance: ₦" + total;
});

// ➕ ADD EXPENSE
window.addExpense = async () => {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!title || !amount) return;

  await addDoc(collection(db, "expenses"), {
    title,
    amount: Number(amount),
    type,
    category,
    date: serverTimestamp()
  });

  form.reset();
};

// ❌ DELETE EXPENSE
window.deleteExpense = async (id) => {
  await deleteDoc(doc(db, "expenses", id));
};
