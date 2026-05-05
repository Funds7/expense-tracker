import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const listEl = document.getElementById("list");

const ctx = document.getElementById("chart").getContext("2d");

let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [{ data: [0, 0] }]
  }
});

async function addTx(type) {
  const desc = document.getElementById("desc");
  const amount = document.getElementById("amount");
  const category = document.getElementById("category");

  if (!desc.value || !amount.value) return;

  await addDoc(collection(db, "expenses"), {
    title: desc.value,
    amount: parseFloat(amount.value),
    category: category.value,
    type,
    date: new Date().toISOString()
  });

  desc.value = "";
  amount.value = "";

  render();
}

async function render() {
  const querySnapshot = await getDocs(collection(db, "expenses"));

  let balance = 0, income = 0, expense = 0;

  listEl.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const t = doc.data();
const id = doc.id;

    const li = document.createElement("li");
    li.innerHTML = `${t.title} (${t.category}) - ₦${t.amount}`;

    if (t.type === "income") {
      income += t.amount;
      balance += t.amount;
    } else {
      expense += t.amount;
      balance -= t.amount;
    }

    listEl.appendChild(li);
  });

  balanceEl.innerText = "₦" + balance;
  incomeEl.innerText = "₦" + income;
  expenseEl.innerText = "₦" + expense;

  chart.data.datasets[0].data = [income, expense];
  chart.update();
}
window.onload = render;
