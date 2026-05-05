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

// ➕ ADD TRANSACTION
window.addTransaction = async () => {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!title || !amount) return;

  await addDoc(collection(db, "transactions"), {
    title,
    amount: Number(amount),
    type // ALWAYS lowercase: income / expense
  });

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
};

// 📥 REALTIME + BALANCE ENGINE
const q = query(collection(db, "transactions"));

onSnapshot(q, (snapshot) => {
  list.innerHTML = "";

  let balance = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const type = data.type;
    const amount = Number(data.amount);

    if (type === "income") {
      balance += amount;
    }

    if (type === "expense") {
      balance -= amount;
    }

    list.innerHTML += `
      <div style="margin-bottom:10px">
        <b>${data.title}</b> - ₦${amount} (${type})
        <button onclick="deleteTx('${docSnap.id}')">X</button>
      </div>
    `;
  });

  balanceEl.innerText = balance;
});

// ❌ DELETE
window.deleteTx = async (id) => {
  await deleteDoc(doc(db, "transactions", id));
};
