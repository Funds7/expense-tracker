let data = JSON.parse(localStorage.getItem("data")) || [];
let lastDeleted = null;

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
  let desc = document.getElementById("desc").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let category = document.getElementById("category").value;

  if (!desc || isNaN(amount)) return;

  data.push({ desc, amount, category, type, date: new Date() });

  save();
}

function render() {
  let balance = 0, income = 0, expense = 0;
  let search = document.getElementById("search").value.toLowerCase();

  listEl.innerHTML = "";

  data.forEach((t, i) => {
    if (!t.desc.toLowerCase().includes(search)) return;

    let li = document.createElement("li");

    li.innerHTML = `
      ${t.desc} (${t.category}) - $${t.amount}
    `;

    li.onclick = () => {
      lastDeleted = t;
      data.splice(i, 1);
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

  localStorage.setItem("data", JSON.stringify(data));
}

function save() {
  localStorage.setItem("data", JSON.stringify(data));
  render();
}

function undo() {
  if (lastDeleted) {
    data.push(lastDeleted);
    lastDeleted = null;
    save();
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function exportCSV() {
  let csv = "Desc,Category,Amount,Type\n";
  data.forEach(t => {
    csv += `${t.desc},${t.category},${t.amount},${t.type}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
}

render();
