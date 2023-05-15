let balance = document.getElementById("balance");
let inflow = document.getElementById("income");
let outflow = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let myChart;

// Get transactions from local storage
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    document.getElementById("error_msg").innerHTML =
      "<span >Error: Please enter description and amount!</span>";
    setTimeout(
      () => (document.getElementById("error_msg").innerHTML = ""),
      5000
    );
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Transactions history
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} ${sign}${Math.abs(
    transaction.amount
  )} <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">X</button>
  `;

  list.appendChild(item);
}


//chart

const displayChart =(total,income,expense)=>{
  const ctx = document.getElementById('myChart');
   myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Balance','outflow', 'inflow'],
          datasets: [{
              label: 'Balance',
              data: [total,income,expense],
              backgroundColor: [
                  'rgb(233 185 211 / 68%)',
              
                  'rgba(255, 206, 86, 0.2)',
              
                  'rgb(90 173 146 / 51%)',
                     
                  
              ],
              
              borderWidth: 0,
          }]
      },
     
  });
  }

  const updateChart = (total,income,expense) => {
    myChart.data.datasets[0].data[0] = total;
    myChart.data.datasets[0].data[1] = expense;
    myChart.data.datasets[0].data[2] = income;
    myChart.update();
  };
  

// Update the balance, inflow and outflow
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((bal, value) => (bal += value), 0).toFixed(2);

  const income = amounts
    .filter((value) => value > 0)
    .reduce((bal, value) => (bal += value), 0)
    .toFixed(2);

  const expense =
    amounts
      .filter((value) => value < 0)
      .reduce((bal, value) => (bal += value), 0) * -(1).toFixed(2);

  balance.innerText = `$${total}`;
  inflow.innerText = `$${income}`;
  outflow.innerText = `$${expense}`;

  if (myChart) {
    updateChart(total,income,expense);
  } else {
    displayChart(total,income,expense);
  }
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  start();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Start app
function start() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

start();

form.addEventListener("submit", addTransaction);



