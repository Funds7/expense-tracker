const state = {
  history: JSON.parse(localStorage.getItem("history")) || [],
  currency: "$",
  theme: "dark"
};

let chart;

function saveData() {
  localStorage.setItem("history", JSON.stringify(state.history));
}

function calculateTotals() {
  let income = 0;
  let expense = 0;

  state.history.forEach(item => {
    if (item.type === "Income") income += item.amount;
    else expense += item.amount;
  });

  return {
    income,
    expense,
    balance: income - expense
  };
}

function updateChart(income, expense) {
  const ctx = document.getElementById("financeChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });
}

function updateUI() {
  const totals = calculateTotals();

  document.getElementById("totalIncome").innerText =
    state.currency + totals.income.toFixed(2);

  document.getElementById("totalExpense").innerText =
    state.currency + totals.expense.toFixed(2);

  document.getElementById("balance").innerText =
    state.currency + totals.balance.toFixed(2);

  updateChart(totals.income, totals.expense);

  renderHistory();
}

// ===== CONTROLS =====

function toggleCurrency() {
  state.currency = state.currency === "$" ? "₦" : "$";
  updateUI();
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

// ===== ACTIONS =====

function addIncome() {
  let amount = parseFloat(prompt("Enter income:"));
  if (isNaN(amount) || amount <= 0) return;

  state.history.push({ type: "Income", amount });
  saveData();
  updateUI();
}

function addExpense() {
  let amount = parseFloat(prompt("Enter expense:"));
  if (isNaN(amount) || amount <= 0) return;

  state.history.push({ type: "Expense", amount });
  saveData();
  updateUI();
}

function deleteItem(index) {
  state.history.splice(index, 1);
  saveData();
  updateUI();
}

function editItem(index) {
  let current = state.history[index];

  let newAmount = parseFloat(prompt("Edit amount:", current.amount));

  if (isNaN(newAmount) || newAmount <= 0) return;

  state.history[index].amount = newAmount;

  saveData();
  updateUI();
}

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";

  state.history.forEach((item, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span class="${item.type.toLowerCase()}">
        ${item.type} ${state.currency}${item.amount.toFixed(2)}
      </span>

      <div>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

updateUI();
