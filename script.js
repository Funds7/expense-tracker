let transactions = JSON.parse(localStorage.getItem("tx")) || [];

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
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
  let balance = 0;
  let income = 0;
  let expense = 0;

  historyEl.innerHTML = "";

  transactions.forEach((t, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${t.desc} (${t.category}) - $${t.amount}
    `;

    li.onclick = () => {
      if (confirm("Delete this transaction?")) {
        transactions.splice(index, 1);
        save();
      }
    };

    if (t.type === "income") {
      income += t.amount;
      balance += t.amount;
      li.style.color = "#22c55e";
    } else {
      expense += t.amount;
      balance -= t.amount;
      li.style.color = "#ef4444";
    }

    historyEl.appendChild(li);
  });

  balanceEl.innerText = "$" + balance;
  incomeEl.innerText = "$" + income;
  expenseEl.innerText = "$" + expense;

  chart.data.datasets[0].data = [income, expense];
  chart.update();

  localStorage.setItem("tx", JSON.stringify(transactions));
}

function addIncome() {
  add("income");
}

function addExpense() {
  add("expense");
}

function add(type) {
  let desc = document.getElementById("desc").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let category = document.getElementById("category").value;

  if (!desc || isNaN(amount)) return;

  transactions.push({ desc, amount, category, type });

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  save();
}

function save() {
  localStorage.setItem("tx", JSON.stringify(transactions));
  update();
}

update();
