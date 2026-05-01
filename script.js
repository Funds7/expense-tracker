let balance = 0;
let history = JSON.parse(localStorage.getItem("history")) || [];

function saveData() {
  localStorage.setItem("history", JSON.stringify(history));
}

function calculateBalance() {
  balance = history.reduce((total, item) => {
    return item.type === "Income"
      ? total + item.amount
      : total - item.amount;
  }, 0);
}

function updateUI() {
  calculateBalance();

  document.getElementById("balance").innerText =
    "$" + balance.toFixed(2);

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

function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";

  history.forEach((item, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span>${item.type} $${item.amount.toFixed(2)}</span>
      <button onclick="deleteItem(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

// Load app
updateUI();
