let balance = 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const balanceEl = document.getElementById("balance");
const historyEl = document.getElementById("history");

const ctx = document.getElementById("chart").getContext("2d");

let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#22c55e", "#ef4444"]
    }]
  }
});

function update() {
  balance = 0;
  let income = 0;
  let expense = 0;

  historyEl.innerHTML = "";

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.desc}: $${t.amount}`;
    li.style.color = t.type === "income" ? "#22c55e" : "#ef4444";
    historyEl.appendChild(li);

    if (t.type === "income") {
      balance += t.amount;
      income += t.amount;
    } else {
      balance -= t.amount;
      expense += t.amount;
    }
  });

  balanceEl.innerText = "$" + balance;

  chart.data.datasets[0].data = [income, expense];
  chart.update();

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addIncome() {
  addTransaction("income");
}

function addExpense() {
  addTransaction("expense");
}

function addTransaction(type) {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!desc || isNaN(amount)) return;

  transactions.push({
    desc,
    amount,
    type
  });

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  update();
}

update();
