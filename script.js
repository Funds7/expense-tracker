import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query
} from "firebase/firestore";

const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");

// ➕ ADD
window.addTransaction = async () => {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!title || !amount) return;

  await addDoc(collection(db, "transactions"), {
    title,
    amount: Number(amount),
    type
  });

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
};

// 📥 REALTIME + BALANCE FIX
const q = query(collection(db, "transactions"));

onSnapshot(q, (snapshot) => {
  list.innerHTML = "";

  let balance = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // 💰 FIX: income vs expense logic
    if (data.type === "income") {
      balance += data.amount;
    } else {
      balance -= data.amount;
    }

    list.innerHTML += `
      <div>
        <b>${data.title}</b> - ₦${data.amount} (${data.type})
        <button onclick="deleteTx('${docSnap.id}')">X</button>
      </div>
    `;
  });

  if (balanceEl) balanceEl.innerText = balance;
});

// ❌ DELETE
window.deleteTx = async (id) => {
  await deleteDoc(doc(db, "transactions", id));
};
