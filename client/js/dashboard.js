
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

// ================= DOM ELEMENTS =================

const transactionBody = document.getElementById("transactionBody");

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmountCard = document.getElementById("expenseAmountCard");

const showFormBtn = document.getElementById("showFormBtn");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

const expenseForm = document.getElementById("expenseForm");

const expenseName = document.getElementById("expenseName");
const expenseCategory = document.getElementById("expenseCategory");
const transactionType = document.getElementById("transactionType");
const expenseAmount = document.getElementById("expenseAmount");
const transactionDate = document.getElementById("transactionDate");

// ================= LOCAL STORAGE =================

function saveToStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ================= RENDER DASHBOARD =================

function renderDashboard() {

    transactionBody.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {

        const row = document.createElement("tr");

        const typeColor = t.type === "income" ? "#22C55E" : "#EF4444";

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.name}</td>
            <td>${t.category}</td>
            <td style="color:${typeColor}; font-weight:600;">
                ${t.type}
            </td>
            <td>₹${t.amount.toLocaleString()}</td>
            <td>
                <button onclick="editTransaction(${t.id})">✏ Edit</button>
                <button onclick="deleteTransaction(${t.id})" class="delete-btn">🗑 Delete</button>
            </td>
        `;

        transactionBody.appendChild(row);

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    balanceAmount.textContent = `₹${(income - expense).toLocaleString()}`;
    incomeAmount.textContent = `₹${income.toLocaleString()}`;
    expenseAmountCard.textContent = `₹${expense.toLocaleString()}`;

    saveToStorage();
}

// ================= ADD / UPDATE TRANSACTION =================

expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newTransaction = {
        id: editId ? editId : Date.now(),
        name: expenseName.value,
        category: expenseCategory.value,
        type: transactionType.value,
        amount: Number(expenseAmount.value),
        date: transactionDate.value
    };

    if (editId) {
        transactions = transactions.map(t =>
            t.id === editId ? newTransaction : t
        );
        editId = null;
    } else {
        transactions.push(newTransaction);
    }

    expenseForm.reset();
    modalOverlay.classList.remove("active");

    renderDashboard();
});

// ================= DELETE =================

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    renderDashboard();
}

// ================= EDIT =================

function editTransaction(id) {

    const txn = transactions.find(t => t.id === id);

    expenseName.value = txn.name;
    expenseCategory.value = txn.category;
    transactionType.value = txn.type;
    expenseAmount.value = txn.amount;
    transactionDate.value = txn.date;

    editId = id;

    modalOverlay.classList.add("active");
}

// ================= MODAL CONTROLS =================

showFormBtn.addEventListener("click", () => {
    modalOverlay.classList.add("active");
});

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
});

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
    }
});

// ================= INITIAL LOAD =================

renderDashboard();