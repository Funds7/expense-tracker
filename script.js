let history = JSON.parse(localStorage.getItem("history")) || [];

function saveData() {
  localStorage.setItem("history", JSON.stringify(history));
}

function calculateTotals() {
  let income = 0;
  let expense = 0;

  history.forEach(item => {
    if (item.type === "Income") income += item.amount;
    else expense += item.amount;
  });

  return {
    income,
    expense,
    balance: income - expense
  };
}

function updateUI() {
  const totals = calculateTotals();

  document.getElementById("totalIncome").innerText =
    "$" + totals.income.toFixed(2);

  document.getElementById("totalExpense").innerText =
    "$" + totals.expense.toFixed(2);

  document.getElementById("balance").innerText =
    "$" + totals.balance.toFixed(2);

  renderHistory();
}

function addIncome() {
  let amount = parseFloat(prompt("Enter income:"));
  if (isNaN(amount) || amount <= 0) return;

  history.push({ type: "Income", amount });
  saveData();
  updateUI();
}

function addExpense() {
  let amount = parseFloat(prompt("Enter expense:"));
  if (isNaN(amount) || amount <= 0) return;

  history.push({ type: "Expense", amount });
  saveData();
  updateUI();
}

function deleteItem(index) {
  history.splice(index, 1);
  saveData();
  updateUI();
}

function editItem(index) {
  let current = history[index];

  let newAmount = parseFloat(
    prompt("Edit amount:", current.amount)
  );

  if (isNaN(newAmount) || newAmount <= 0) return;

  history[index].amount = newAmount;

  saveData();
  updateUI();
}

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";

  history.forEach((item, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span class="${item.type.toLowerCase()}">
        ${item.type} $${item.amount.toFixed(2)}
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
