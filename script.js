let balance = 0;

function addIncome() {
  let amount = prompt("Enter income:");
  amount = parseFloat(amount);

  if (!isNaN(amount)) {
    balance += amount;
    alert("Income added! Balance: " + balance);
  }
}

function addExpense() {
  let amount = prompt("Enter expense:");
  amount = parseFloat(amount);

  if (!isNaN(amount)) {
    balance -= amount;
    alert("Expense added! Balance: " + balance);
  }
}
