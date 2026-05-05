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

// 🔥 ADD TRANSACTION
window.addTransaction = async () => {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!title || !amount) return;

  await addDoc(collection(db, "transactions"), {
    title,
    amount: Number(amount),
    type,
    date: new Date()
  });

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
};

// 📥 REALTIME GET DATA
const q = query(collection(db, "transactions"));

onSnapshot(q, (snapshot) => {
  list.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    list.innerHTML += `
      <div>
        <b>${data.title}</b> - ₦${data.amount} (${data.type})
        <button onclick="deleteTx('${docSnap.id}')">X</button>
      </div>
    `;
  });
});

// ❌ DELETE
window.deleteTx = async (id) => {
  await deleteDoc(doc(db, "transactions", id));
};
