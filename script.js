let balance = 0;

function updateUI() {
  document.getElementById("balance").innerText = "$" + balance;
}

function addIncome() {
  let amount = parseFloat(prompt("Enter income:"));
  if (isNaN(amount) || amount <= 0) return;

  balance += amount;

  addToHistory("Income", amount);
  updateUI();
}

function addExpense() {
  let amount = parseFloat(prompt("Enter expense:"));
  if (isNaN(amount) || amount <= 0) return;

  balance -= amount;

  addToHistory("Expense", amount);
  updateUI();
}

function addToHistory(type, amount) {
  let li = document.createElement("li");
  li.innerHTML = `<span>${type}</span> <span>$${amount}</span>`;

  document.getElementById("history").appendChild(li);
}
updateUI();
