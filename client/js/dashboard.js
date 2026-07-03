// ==========================================
// EXPENSE TRACKER DASHBOARD
// dashboard.js
// CHUNK 1
// ==========================================

// ---------------- STORAGE ----------------

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

let incomeExpenseChart = null;
let categoryChart = null;
let monthlyChart = null;

// ---------------- DOM ----------------

const transactionBody =
    document.getElementById("transactionBody");

const balanceAmount =
    document.getElementById("balanceAmount");

const incomeAmount =
    document.getElementById("incomeAmount");

const expenseAmountCard =
    document.getElementById("expenseAmountCard");

const totalTransactions =
    document.getElementById("totalTransactions");

const savingsAmount =
    document.getElementById("savingsAmount");

const highestExpense =
    document.getElementById("highestExpense");

// ---------- FORM ----------

const expenseForm =
    document.getElementById("expenseForm");

const expenseName =
    document.getElementById("expenseName");

const expenseCategory =
    document.getElementById("expenseCategory");

const transactionType =
    document.getElementById("transactionType");

const expenseAmount =
    document.getElementById("expenseAmount");

const transactionDate =
    document.getElementById("transactionDate");

// ---------- MODAL ----------

const modalOverlay =
    document.getElementById("modalOverlay");

const showFormBtn =
    document.getElementById("showFormBtn");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

// ---------- SEARCH ----------

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortTransactions =
    document.getElementById("sortTransactions");

// ---------- SIDEBAR ----------

const dashboardBtn =
    document.getElementById("dashboardBtn");

const expenseBtn =
    document.getElementById("expenseBtn");

const incomeBtn =
    document.getElementById("incomeBtn");

const analyticsBtn =
    document.getElementById("analyticsBtn");

const settingsBtn =
    document.getElementById("settingsBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

// ---------- SECTIONS ----------

const dashboardSection =
    document.getElementById("dashboardSection");

const analyticsSection =
    document.getElementById("analyticsSection");

const settingsSection =
    document.getElementById("settingsSection");

// ---------- SETTINGS ----------

const clearDataBtn =
    document.getElementById("clearDataBtn");

const exportBtn =
    document.getElementById("exportBtn");

// ---------- LOGOUT ----------

const logoutModal =
    document.getElementById("logoutModal");

const confirmLogout =
    document.getElementById("confirmLogout");

const cancelLogout =
    document.getElementById("cancelLogout");

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(value) {

    return "₹" + Number(value).toLocaleString("en-IN");

}

// ==========================================
// DASHBOARD TOTALS
// ==========================================

function updateSummaryCards() {

    let income = 0;
    let expense = 0;
    let highest = 0;

    transactions.forEach(t => {

        if (t.type === "income") {

            income += t.amount;

        } else {

            expense += t.amount;

            if (t.amount > highest) {

                highest = t.amount;

            }

        }

    });

    balanceAmount.textContent =
        formatMoney(income - expense);

    incomeAmount.textContent =
        formatMoney(income);

    expenseAmountCard.textContent =
        formatMoney(expense);

    totalTransactions.textContent =
        transactions.length;

    savingsAmount.textContent =
        formatMoney(income - expense);

    highestExpense.textContent =
        formatMoney(highest);

}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTransactions(data = transactions) {

    transactionBody.innerHTML = "";

    if (data.length === 0) {

        transactionBody.innerHTML = `

        <tr>

            <td colspan="6"
                style="
                text-align:center;
                padding:35px;
                color:#64748b;">

                No Transactions Found

            </td>

        </tr>

        `;

        updateSummaryCards();

        return;

    }

    data.forEach(transaction => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${transaction.date}</td>

        <td>${transaction.name}</td>

        <td>${transaction.category}</td>

        <td class="${transaction.type}">

            ${transaction.type}

        </td>

        <td>

            ${formatMoney(transaction.amount)}

        </td>

        <td>

            <button
                class="edit-btn"
                onclick="editTransaction(${transaction.id})">

                Edit

            </button>

            <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                Delete

            </button>

        </td>

        `;

        transactionBody.appendChild(row);

    });

    updateSummaryCards();

}
// ==========================================
// CHUNK 2
// ADD / EDIT / DELETE / MODAL
// ==========================================

// ---------- OPEN MODAL ----------

showFormBtn.addEventListener("click", () => {

    expenseForm.reset();

    editId = null;

    modalOverlay.classList.add("active");

});

// ---------- CLOSE MODAL ----------

closeModal.addEventListener("click", closeExpenseModal);

cancelBtn.addEventListener("click", closeExpenseModal);

modalOverlay.addEventListener("click", (e) => {

    if (e.target === modalOverlay) {

        closeExpenseModal();

    }

});

function closeExpenseModal() {

    modalOverlay.classList.remove("active");

}

// ---------- ADD / UPDATE ----------

expenseForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const transaction = {

        id: editId ? editId : Date.now(),

        name: expenseName.value.trim(),

        category: expenseCategory.value,

        type: transactionType.value,

        amount: Number(expenseAmount.value),

        date: transactionDate.value

    };

    if (transaction.name === "") {

        alert("Please enter transaction name.");

        return;

    }

    if (transaction.amount <= 0) {

        alert("Amount must be greater than 0.");

        return;

    }

    if (transaction.date === "") {

        alert("Please select a date.");

        return;

    }

    if (editId) {

        const index = transactions.findIndex(t => t.id === editId);

        transactions[index] = transaction;

        editId = null;

    }

    else {

        transactions.push(transaction);

    }

    saveTransactions();

    renderTransactions();

    updateCharts();

    closeExpenseModal();

    expenseForm.reset();

});

// ---------- DELETE ----------

function deleteTransaction(id) {

    const confirmDelete = confirm(

        "Delete this transaction?"

    );

    if (!confirmDelete) return;

    transactions = transactions.filter(

        t => t.id !== id

    );

    saveTransactions();

    renderTransactions();

    updateCharts();

}

// ---------- EDIT ----------

function editTransaction(id) {

    const transaction = transactions.find(

        t => t.id === id

    );

    if (!transaction) return;

    editId = id;

    expenseName.value = transaction.name;

    expenseCategory.value = transaction.category;

    transactionType.value = transaction.type;

    expenseAmount.value = transaction.amount;

    transactionDate.value = transaction.date;

    modalOverlay.classList.add("active");

}

// ---------- REFRESH ----------

function refreshDashboard() {

    renderTransactions();

    updateSummaryCards();

    updateCharts();

}
// ==========================================
// CHUNK 3
// SIDEBAR + NAVIGATION + SEARCH + FILTER + SORT
// ==========================================

// ---------- ACTIVE MENU ----------

function setActive(btn) {

    document.querySelectorAll(".menu li")
        .forEach(item => item.classList.remove("active"));

    btn.classList.add("active");
}

// ---------- DASHBOARD VIEW ----------

dashboardBtn.addEventListener("click", () => {

    showSection("dashboard");

    renderTransactions();

    setActive(dashboardBtn);

});

// ---------- EXPENSE VIEW ----------

expenseBtn.addEventListener("click", () => {

    showSection("dashboard");

    const expenses = transactions.filter(
        t => t.type === "expense"
    );

    renderTransactions(expenses);

    setActive(expenseBtn);

});

// ---------- INCOME VIEW ----------

incomeBtn.addEventListener("click", () => {

    showSection("dashboard");

    const income = transactions.filter(
        t => t.type === "income"
    );

    renderTransactions(income);

    setActive(incomeBtn);

});

// ---------- ANALYTICS VIEW ----------

analyticsBtn.addEventListener("click", () => {

    showSection("analytics");

    updateCharts();

    setActive(analyticsBtn);

});

// ---------- SETTINGS VIEW ----------

settingsBtn.addEventListener("click", () => {

    showSection("settings");

    setActive(settingsBtn);

});

// ---------- LOGOUT ----------

logoutBtn.addEventListener("click", () => {

    logoutModal.classList.add("active");

});

cancelLogout.addEventListener("click", () => {

    logoutModal.classList.remove("active");

});

confirmLogout.addEventListener("click", () => {

    localStorage.removeItem("transactions");

    window.location.href = "login.html";

});

// ---------- SEARCH ----------

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = transactions.filter(t =>

        t.name.toLowerCase().includes(keyword) ||
        t.category.toLowerCase().includes(keyword)

    );

    renderTransactions(filtered);

});

// ---------- FILTER ----------

categoryFilter.addEventListener("change", () => {

    if (categoryFilter.value === "all") {

        renderTransactions();

        return;

    }

    const filtered = transactions.filter(t =>

        t.category === categoryFilter.value

    );

    renderTransactions(filtered);

});

// ---------- SORT ----------

sortTransactions.addEventListener("change", () => {

    let sorted = [...transactions];

    switch (sortTransactions.value) {

        case "latest":
            sorted.sort((a, b) =>
                new Date(b.date) - new Date(a.date));
            break;

        case "oldest":
            sorted.sort((a, b) =>
                new Date(a.date) - new Date(b.date));
            break;

        case "high":
            sorted.sort((a, b) =>
                b.amount - a.amount);
            break;

        case "low":
            sorted.sort((a, b) =>
                a.amount - b.amount);
            break;
    }

    renderTransactions(sorted);

});

// ---------- SECTION SWITCHER ----------

function showSection(section) {

    dashboardSection.classList.add("hidden");
    analyticsSection.classList.add("hidden");
    settingsSection.classList.add("hidden");

    if (section === "dashboard") {
        dashboardSection.classList.remove("hidden");
    }

    if (section === "analytics") {
        analyticsSection.classList.remove("hidden");
    }

    if (section === "settings") {
        settingsSection.classList.remove("hidden");
    }
}
// ==========================================
// CHUNK 4 (FINAL)
// CHARTS + EXPORT + CLEAR + INIT
// ==========================================

// ---------- UPDATE CHARTS ----------

function updateCharts() {

    renderIncomeExpenseChart();
    renderCategoryChart();
    renderMonthlyChart();

}

// ---------- INCOME vs EXPENSE CHART ----------

function renderIncomeExpenseChart() {

    const ctx = document.getElementById("incomeExpenseChart");

    if (!ctx) return;

    if (incomeExpenseChart) incomeExpenseChart.destroy();

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

        if (t.type === "income") income += t.amount;
        else expense += t.amount;

    });

    incomeExpenseChart = new Chart(ctx, {

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

// ---------- CATEGORY CHART ----------

function renderCategoryChart() {

    const ctx = document.getElementById("categoryChart");

    if (!ctx) return;

    if (categoryChart) categoryChart.destroy();

    const map = {};

    transactions.forEach(t => {

        if (t.type === "expense") {

            map[t.category] =
                (map[t.category] || 0) + t.amount;

        }

    });

    categoryChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: Object.keys(map),

            datasets: [{

                data: Object.values(map),

                backgroundColor: [

                    "#3b82f6",
                    "#22c55e",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6"

                ]

            }]

        }

    });

}

// ---------- MONTHLY CHART ----------

function renderMonthlyChart() {

    const ctx = document.getElementById("monthlyChart");

    if (!ctx) return;

    if (monthlyChart) monthlyChart.destroy();

    const months = Array(12).fill(0);

    transactions.forEach(t => {

        if (t.type === "expense") {

            const m = new Date(t.date).getMonth();

            months[m] += t.amount;

        }

    });

    monthlyChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Jan","Feb","Mar","Apr","May","Jun",

                "Jul","Aug","Sep","Oct","Nov","Dec"

            ],

            datasets: [{

                label: "Expenses",

                data: months,

                backgroundColor: "#3b82f6"

            }]

        }

    });

}

// ---------- CLEAR DATA ----------

clearDataBtn.addEventListener("click", () => {

    if (!confirm("Clear all transactions?")) return;

    transactions = [];

    saveTransactions();

    renderTransactions();

    updateCharts();

});

// ---------- EXPORT CSV ----------

exportBtn.addEventListener("click", () => {

    if (transactions.length === 0) {

        alert("No data to export");

        return;

    }

    let csv = "Name,Category,Type,Amount,Date\n";

    transactions.forEach(t => {

        csv += `${t.name},${t.category},${t.type},${t.amount},${t.date}\n`;

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "transactions.csv";

    a.click();

});

// ---------- INIT APP ----------

document.addEventListener("DOMContentLoaded", () => {

    renderTransactions();

    updateCharts();

});