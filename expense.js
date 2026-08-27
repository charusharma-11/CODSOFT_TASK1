const transactionForm = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const transactionTypeInput = document.getElementById("transactionType");

const transactionList = document.getElementById("transactionList");
const filterCategory = document.getElementById("filterCategory");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const currentBalance = document.getElementById("currentBalance");

const submitBtn = document.getElementById("submitBtn");

const typeButtons = document.querySelectorAll(".type-btn");

let transactions = JSON.parse(localStorage.getItem("moneyMateTransactions")) || [];

let editingId = null;


// TODAY'S DATE

const today = new Date();
const todayFormatted = today.toISOString().split("T")[0];

dateInput.value = todayFormatted;


// TYPE BUTTONS

typeButtons.forEach(button => {

    button.addEventListener("click", () => {

        typeButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        transactionTypeInput.value = button.dataset.type;

    });

});


// ADD / EDIT TRANSACTION

transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const type = transactionTypeInput.value;

    if (!description || !amount || amount <= 0 || !category || !date) {
        alert("Please fill all the details correctly.");
        return;
    }


    // EDIT EXISTING TRANSACTION

    if (editingId !== null) {

        transactions = transactions.map(transaction => {

            if (transaction.id === editingId) {

                return {
                    ...transaction,
                    description,
                    amount,
                    category,
                    date,
                    type
                };

            }

            return transaction;

        });

        editingId = null;

        submitBtn.textContent = "+ Add Transaction";

    }


    // ADD NEW TRANSACTION

    else {

        const newTransaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            category: category,

            date: date,

            type: type

        };

        transactions.unshift(newTransaction);

    }


    saveTransactions();

    transactionForm.reset();

    dateInput.value = todayFormatted;

    transactionTypeInput.value = "expense";

    typeButtons.forEach(btn => btn.classList.remove("active"));

    document
        .querySelector('[data-type="expense"]')
        .classList.add("active");

});


// SAVE TO LOCAL STORAGE

function saveTransactions() {

    localStorage.setItem(
        "moneyMateTransactions",
        JSON.stringify(transactions)
    );

    renderTransactions();

    updateSummary();

}


// UPDATE SUMMARY

function updateSummary() {

    let income = 0;

    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });

    const balance = income - expense;

    totalIncome.textContent = formatCurrency(income);

    totalExpense.textContent = formatCurrency(expense);

    currentBalance.textContent = formatCurrency(balance);

}


// FORMAT MONEY

function formatCurrency(amount) {

    return "₹" + amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });

}


// RENDER TRANSACTIONS

function renderTransactions() {

    const selectedCategory = filterCategory.value;

    let filteredTransactions = transactions;

    if (selectedCategory !== "All") {

        filteredTransactions = transactions.filter(
            transaction => transaction.category === selectedCategory
        );

    }


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-state">
                <div>📊</div>
                <p>No transactions found</p>
                <span>Add a transaction or change the filter.</span>
            </div>
        `;

        return;

    }


    transactionList.innerHTML = "";

    filteredTransactions.forEach(transaction => {

        const transactionElement = document.createElement("div");

        transactionElement.className = "transaction";

        const icon = transaction.type === "income" ? "↗" : "↘";

        const sign = transaction.type === "income" ? "+" : "-";

        transactionElement.innerHTML = `

            <div class="transaction-info">

                <div class="transaction-icon ${transaction.type}">
                    ${icon}
                </div>

                <div>

                    <div class="transaction-name">
                        ${escapeHTML(transaction.description)}
                    </div>

                    <div class="transaction-meta">
                        ${escapeHTML(transaction.category)}
                        •
                        ${formatDate(transaction.date)}
                    </div>

                </div>

            </div>


            <div class="transaction-right">

                <div class="transaction-amount ${transaction.type}">
                    ${sign}${formatCurrency(transaction.amount)}
                </div>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${transaction.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

        transactionList.appendChild(transactionElement);

    });

}


// FORMAT DATE

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// EDIT

function editTransaction(id) {

    const transaction = transactions.find(
        item => item.id === id
    );

    if (!transaction) return;


    descriptionInput.value = transaction.description;

    amountInput.value = transaction.amount;

    categoryInput.value = transaction.category;

    dateInput.value = transaction.date;

    transactionTypeInput.value = transaction.type;


    typeButtons.forEach(btn => {

        btn.classList.toggle(
            "active",
            btn.dataset.type === transaction.type
        );

    });


    editingId = id;

    submitBtn.textContent = "✓ Update Transaction";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// DELETE

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();

}


// FILTER

filterCategory.addEventListener("change", function() {

    renderTransactions();

});


// SECURITY HELPER

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// INITIAL LOAD

renderTransactions();

updateSummary();