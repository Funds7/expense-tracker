let balance = 0;

function updateUI() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function addIncome() {
  let amount = parseFloat(prompt("Enter income:"));

  if (!isNaN(amount) && amount > 0) {
    balance += amount;
    updateUI();
  }
}

function addExpense() {
  let amount = parseFloat(prompt("Enter expense:"));

  if (!isNaN(amount) && amount > 0) {
    balance -= amount;
    updateUI();
  }
}
