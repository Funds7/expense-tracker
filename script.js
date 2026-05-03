let balance = 0;
let history = [];

function updateUI() {
  document.getElementById("balance").innerText = "$" + balance;

  let list = document.getElementById("history");
  list.innerHTML = "";

  history.forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    list.appendChild(li);
  });
}

function addIncome() {
  let amount = parseFloat(prompt("Enter income:"));
  if (isNaN(amount)) return;

  balance += amount;
  history.push("+ $" + amount + " Income");
  updateUI();
}

function addExpense() {
  let amount = parseFloat(prompt("Enter expense:"));
  if (isNaN(amount)) return;

  balance -= amount;
  history.push("- $" + amount + " Expense");
  updateUI();
}

updateUI();
