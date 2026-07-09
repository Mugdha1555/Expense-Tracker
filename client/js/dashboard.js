// ==========================================
// EXPENSE TRACKER DASHBOARD
// CHUNK 1 - VARIABLES & DOM
// ==========================================

// ---------- AUTH ----------

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// ---------- GLOBAL VARIABLES ----------

let transactions = [];
let editId = null;

let incomeExpenseChart = null;
let categoryChart = null;
let monthlyChart = null;

// ---------- TABLE ----------

const transactionBody =
    document.getElementById("transactionBody");

// ---------- SUMMARY CARDS ----------

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
// CHUNK 2
// UTILITIES + LOAD TRANSACTIONS
// ==========================================

// ---------- FORMAT MONEY ----------

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}

// ---------- LOAD TRANSACTIONS ----------

async function loadTransactions() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/expenses",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error("Failed to fetch expenses.");

        }

        transactions = await response.json();

        console.log("Transactions Loaded:", transactions);

        renderTransactions();

        updateSummaryCards();

        updateCharts();

    } catch (error) {

        console.error(error);

        alert("Unable to load transactions.");

    }

}

// ---------- SUMMARY CARDS ----------

function updateSummaryCards() {

    let totalExpense = 0;
    let highest = 0;

    transactions.forEach(transaction => {

        totalExpense += Number(transaction.amount);

        if (Number(transaction.amount) > highest) {

            highest = Number(transaction.amount);

        }

    });

    if (balanceAmount)
        balanceAmount.textContent = formatMoney(0);

    if (incomeAmount)
        incomeAmount.textContent = formatMoney(0);

    if (expenseAmountCard)
        expenseAmountCard.textContent = formatMoney(totalExpense);

    if (totalTransactions)
        totalTransactions.textContent = transactions.length;

    if (savingsAmount)
        savingsAmount.textContent = formatMoney(0);

    if (highestExpense)
        highestExpense.textContent = formatMoney(highest);

}

// ---------- EMPTY CHARTS ----------

function updateCharts() {

    // Will be completed later.

}
// ==========================================
// CHUNK 3
// RENDER TRANSACTIONS
// ==========================================

function renderTransactions(data = transactions) {

    if (!transactionBody) return;

    transactionBody.innerHTML = "";

    if (data.length === 0) {

        transactionBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:30px;">
                    No Transactions Found
                </td>
            </tr>
        `;

        return;

    }

    data.forEach(transaction => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${new Date(transaction.date).toLocaleDateString("en-IN")}
            </td>

            <td>
                ${transaction.title}
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>
                ${formatMoney(transaction.amount)}
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editTransaction('${transaction._id}')">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction('${transaction._id}')">

                    Delete

                </button>

            </td>

        `;

        transactionBody.appendChild(row);

    });

}
// ==========================================
// CHUNK 4
// MODAL + ADD + EDIT + DELETE
// ==========================================

// ---------- OPEN MODAL ----------

if (showFormBtn) {

    showFormBtn.addEventListener("click", () => {

        editId = null;

        expenseForm.reset();

        modalOverlay.classList.add("active");

    });

}

// ---------- CLOSE MODAL ----------

function closeExpenseModal() {

    modalOverlay.classList.remove("active");

}

if (closeModal) {

    closeModal.addEventListener("click", closeExpenseModal);

}

if (cancelBtn) {

    cancelBtn.addEventListener("click", closeExpenseModal);

}

if (modalOverlay) {

    modalOverlay.addEventListener("click", (e) => {

        if (e.target === modalOverlay) {

            closeExpenseModal();

        }

    });

}

// ---------- SAVE TRANSACTION ----------

expenseForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const expense = {

        title: expenseName.value.trim(),

        amount: Number(expenseAmount.value),

        category: expenseCategory.value,

        date: transactionDate.value

    };

    if (!expense.title) {

        alert("Enter transaction name.");

        return;

    }

    if (expense.amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    if (!expense.date) {

        alert("Select a date.");

        return;

    }

    try {

        let response;

        if (editId) {

            response = await fetch(

                `http://localhost:5000/api/expenses/${editId}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify(expense)

                }

            );

        } else {

            response = await fetch(

                "http://localhost:5000/api/expenses",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify(expense)

                }

            );

        }

        if (!response.ok) {

            throw new Error("Failed to save expense.");

        }

        editId = null;

        expenseForm.reset();

        closeExpenseModal();

        await loadTransactions();

    } catch (error) {

        console.error(error);

        alert("Unable to save expense.");

    }

});

// ---------- DELETE ----------

async function deleteTransaction(id) {

    if (!confirm("Delete this expense?")) return;

    try {

        const response = await fetch(

            `http://localhost:5000/api/expenses/${id}`,

            {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        if (!response.ok) {

            throw new Error("Delete failed.");

        }

        await loadTransactions();

    } catch (error) {

        console.error(error);

        alert("Unable to delete expense.");

    }

}

// ---------- EDIT ----------

function editTransaction(id) {

    const transaction = transactions.find(

        t => t._id === id

    );

    if (!transaction) return;

    editId = id;

    expenseName.value = transaction.title;

    expenseCategory.value = transaction.category;

    expenseAmount.value = transaction.amount;

    transactionDate.value =
        new Date(transaction.date)
            .toISOString()
            .split("T")[0];

    modalOverlay.classList.add("active");

}
// ==========================================
// CHUNK 5
// SEARCH + FILTER + SIDEBAR + NAVIGATION
// ==========================================

// ---------- SHOW SECTION ----------

function showSection(section) {

    if (dashboardSection)
        dashboardSection.classList.add("hidden");

    if (analyticsSection)
        analyticsSection.classList.add("hidden");

    if (settingsSection)
        settingsSection.classList.add("hidden");

    switch (section) {

        case "dashboard":
            if (dashboardSection)
                dashboardSection.classList.remove("hidden");
            break;

        case "analytics":
            if (analyticsSection)
                analyticsSection.classList.remove("hidden");
            break;

        case "settings":
            if (settingsSection)
                settingsSection.classList.remove("hidden");
            break;
    }

}

// ---------- ACTIVE MENU ----------

function setActive(button) {

    document.querySelectorAll(".menu li").forEach(item => {
        item.classList.remove("active");
    });

    if (button)
        button.classList.add("active");

}

// ---------- SIDEBAR ----------

if (dashboardBtn) {

    dashboardBtn.addEventListener("click", () => {

        showSection("dashboard");

        renderTransactions();

        setActive(dashboardBtn);

    });

}

if (analyticsBtn) {

    analyticsBtn.addEventListener("click", () => {

        showSection("analytics");

        updateCharts();

        setActive(analyticsBtn);

    });

}

if (settingsBtn) {

    settingsBtn.addEventListener("click", () => {

        showSection("settings");

        setActive(settingsBtn);

    });

}

// ---------- SEARCH ----------

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value.toLowerCase();

        const filtered = transactions.filter(transaction =>

            transaction.title.toLowerCase().includes(keyword) ||

            transaction.category.toLowerCase().includes(keyword)

        );

        renderTransactions(filtered);

    });

}

// ---------- CATEGORY FILTER ----------

if (categoryFilter) {

    categoryFilter.addEventListener("change", () => {

        const category = categoryFilter.value;

        if (category === "All") {

            renderTransactions();

            return;

        }

        const filtered = transactions.filter(

            transaction => transaction.category === category

        );

        renderTransactions(filtered);

    });

}

// ---------- SORT ----------

if (sortTransactions) {

    sortTransactions.addEventListener("change", () => {

        const sorted = [...transactions];

        switch (sortTransactions.value) {

            case "latest":

                sorted.sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );

                break;

            case "oldest":

                sorted.sort((a, b) =>
                    new Date(a.date) - new Date(b.date)
                );

                break;

            case "highest":

                sorted.sort((a, b) =>
                    b.amount - a.amount
                );

                break;

            case "lowest":

                sorted.sort((a, b) =>
                    a.amount - b.amount
                );

                break;

        }

        renderTransactions(sorted);

    });

}
// ==========================================
// CHUNK 6
// ANALYTICS CHARTS
// ==========================================

// ---------- INCOME / EXPENSE CHART ----------

function renderIncomeExpenseChart() {

    const canvas = document.getElementById("incomeExpenseChart");

    if (!canvas) return;

    if (incomeExpenseChart)
        incomeExpenseChart.destroy();

    const totalExpense = transactions.reduce((sum, t) => {
        return sum + Number(t.amount);
    }, 0);

    incomeExpenseChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: ["Expenses"],

            datasets: [{

                data: [totalExpense],

                backgroundColor: ["#EF4444"]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ---------- CATEGORY CHART ----------

function renderCategoryChart() {

    const canvas = document.getElementById("categoryChart");

    if (!canvas) return;

    if (categoryChart)
        categoryChart.destroy();

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (!categoryTotals[transaction.category]) {

            categoryTotals[transaction.category] = 0;

        }

        categoryTotals[transaction.category] += Number(transaction.amount);

    });

    categoryChart = new Chart(canvas, {

        type: "pie",

        data: {

            labels: Object.keys(categoryTotals),

            datasets: [{

                data: Object.values(categoryTotals)

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ---------- MONTHLY CHART ----------

function renderMonthlyChart() {

    const canvas = document.getElementById("monthlyChart");

    if (!canvas) return;

    if (monthlyChart)
        monthlyChart.destroy();

    const monthlyTotals = {};

    transactions.forEach(transaction => {

        const month = new Date(transaction.date)
            .toLocaleString("default", {
                month: "short"
            });

        if (!monthlyTotals[month]) {

            monthlyTotals[month] = 0;

        }

        monthlyTotals[month] += Number(transaction.amount);

    });

    monthlyChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: Object.keys(monthlyTotals),

            datasets: [{

                label: "Expenses",

                data: Object.values(monthlyTotals)

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ---------- UPDATE ALL CHARTS ----------

function updateCharts() {

    renderIncomeExpenseChart();

    renderCategoryChart();

    renderMonthlyChart();

}
// ==========================================
// CHUNK 7
// EXPORT + CLEAR DATA + LOGOUT
// ==========================================

// ---------- EXPORT CSV ----------

if (exportBtn) {

    exportBtn.addEventListener("click", () => {

        if (transactions.length === 0) {

            alert("No transactions to export.");

            return;

        }

        let csv = "Title,Category,Amount,Date\n";

        transactions.forEach(transaction => {

            csv += `"${transaction.title}","${transaction.category}",${transaction.amount},"${new Date(transaction.date).toLocaleDateString()}"\n`;

        });

        const blob = new Blob([csv], {

            type: "text/csv"

        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "expenses.csv";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    });

}

// ---------- CLEAR ALL DATA ----------

if (clearDataBtn) {

    clearDataBtn.addEventListener("click", async () => {

        const confirmDelete = confirm(

            "Delete ALL expenses permanently?"

        );

        if (!confirmDelete) return;

        try {

            for (const transaction of transactions) {

                await fetch(

                    `http://localhost:5000/api/expenses/${transaction._id}`,

                    {

                        method: "DELETE",

                        headers: {

                            Authorization: `Bearer ${token}`

                        }

                    }

                );

            }

            await loadTransactions();

            alert("All expenses deleted.");

        } catch (error) {

            console.error(error);

            alert("Unable to delete all expenses.");

        }

    });

}

// ---------- LOGOUT ----------

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        if (logoutModal) {

            logoutModal.classList.add("active");

        } else {

            localStorage.removeItem("token");

            window.location.href = "login.html";

        }

    });

}

if (confirmLogout) {

    confirmLogout.addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href = "login.html";

    });

}

if (cancelLogout) {

    cancelLogout.addEventListener("click", () => {

        logoutModal.classList.remove("active");

    });

}
// ==========================================
// CHUNK 8
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Dashboard Initialized");

    // Load all transactions
    await loadTransactions();

    // Show dashboard by default
    showSection("dashboard");

    // Highlight dashboard menu
    if (dashboardBtn) {
        setActive(dashboardBtn);
    }

});