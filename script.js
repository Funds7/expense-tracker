let data = JSON.parse(localStorage.getItem("data")) || [];
let deletedStack = [];

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

function addTx(type) {
  const desc = document.getElementById("desc");
  const amount = document.getElementById("amount");
  const category = document.getElementById("category");

  if (!desc.value || !amount.value) return;

  data.push({
    desc: desc.value,
    amount: parseFloat(amount.value),
    category: category.value,
    type,
    date: new Date().toISOString()
  });

  desc.value = "";
  amount.value = "";

  save();
}

function render() {
  const search = document.getElementById("search").value.toLowerCase();

  let balance = 0, income = 0, expense = 0;

  listEl.innerHTML = "";

  data.forEach((t, index) => {
    if (!t.desc.toLowerCase().includes(search)) return;

    const li = document.createElement("li");

    li.innerHTML = `
      ${t.desc} (${t.category}) - $${t.amount}
    `;

    li.onclick = () => {
      deletedStack.push(t);
      data.splice(index, 1);
      save();
    };

    if (t.type === "income") {
      income += t.amount;
      balance += t.amount;
    } else {
      expense += t.amount;
      balance -= t.amount;
    }

    listEl.appendChild(li);
  });

  balanceEl.innerText = "$" + balance;
  incomeEl.innerText = "$" + income;
  expenseEl.innerText = "$" + expense;

  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

function save() {
  localStorage.setItem("data", JSON.stringify(data));
  render();
}

function undo() {
  if (deletedStack.length === 0) return;

  data.push(deletedStack.pop());
  save();
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function exportCSV() {
  let csv = "Desc,Category,Amount,Type\n";

  data.forEach(t => {
    csv += `${t.desc},${t.category},${t.amount},${t.type}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
}

render();
