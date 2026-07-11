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

    function renderActivityTimeline(){

    const container =
        document.getElementById("activityTimeline");

    if(!container) return;

    container.innerHTML="";

    const latest =
        [...transactions]
        .sort((a,b)=>
            new Date(b.date)-new Date(a.date))
        .slice(0,5);

    latest.forEach(transaction=>{

        const div=document.createElement("div");

        div.className="activity-item";

        div.innerHTML=`

        <div class="activity-left">

            <div class="activity-icon ${transaction.type==="income"
                ?"income-icon"
                :"expense-icon"}">

                ${transaction.type==="income"
                    ?"📈"
                    :"💸"}

            </div>

            <div>

                <div class="activity-title">

                    ${transaction.title}

                </div>

                <div class="activity-date">

                    ${new Date(transaction.date)
                        .toLocaleDateString("en-IN")}

                </div>

            </div>

        </div>

        <div class="activity-amount">

            ${formatMoney(transaction.amount)}

        </div>

        `;

        container.appendChild(div);

    });

}

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

    const budgetInput =
    document.getElementById("budgetInput");

const saveBudgetBtn =
    document.getElementById("saveBudgetBtn");

// ---------- LOGOUT ----------

const logoutModal =
    document.getElementById("logoutModal");

const confirmLogout =
    document.getElementById("confirmLogout");

const cancelLogout =
    document.getElementById("cancelLogout");

    // ---------- TOAST ----------

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

function showToast(message) {

    if (!toast) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}
    // ==========================================
// CHUNK 2
// UTILITIES + LOAD TRANSACTIONS
// ==========================================

// ---------- FORMAT MONEY ----------

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}
// ---------- ANIMATE NUMBER ----------

function animateValue(element, start, end, duration = 1200) {

    if (!element) return;

    let startTime = null;

    function animation(currentTime) {

        if (!startTime)
            startTime = currentTime;

        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        const value = Math.floor(
            progress * (end - start) + start
        );

        element.textContent = formatMoney(value);

        if (progress < 1) {

            requestAnimationFrame(animation);

        }

    }

    requestAnimationFrame(animation);

}

// ---------- LOAD TRANSACTIONS ----------

async function loadTransactions() {

    try {

       const response = await fetch(
    `${API_URL}/expenses`,
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
// ---------- BUDGET TRACKER ----------

function updateBudgetTracker(totalExpense){
    const budget =
    Number(localStorage.getItem("monthlyBudget")) || 40000;

    

    const progress =
        document.getElementById("budgetProgress");

    const percent =
        document.getElementById("budgetPercent");

    const spent =
        document.getElementById("budgetSpent");

    if(!progress) return;

    const percentage =
        Math.min((totalExpense / budget) * 100,100);

    progress.style.width =
        percentage + "%";

    spent.textContent =
    formatMoney(totalExpense);

document.getElementById("budgetLimit").textContent =
    formatMoney(budget);
    percent.textContent =
        percentage.toFixed(0) + "%";

    if(totalExpense > budget){

        progress.style.background =
        "linear-gradient(90deg,#ef4444,#dc2626)";

    } else {

        progress.style.background =
        "linear-gradient(90deg,#10B981,#22C55E)";

    }

}

// ---------- FINANCIAL INSIGHTS ----------

function updateInsights(totalIncome, totalExpense) {

    const insights = document.getElementById("insightsList");

    if (!insights) return;

    insights.innerHTML = "";

    const expenses = transactions.filter(
        t => t.type === "expense"
    );

    const incomes = transactions.filter(
        t => t.type === "income"
    );

    // Highest Expense

    let highestExpense = null;

    expenses.forEach(expense => {

        if (
            !highestExpense ||
            expense.amount > highestExpense.amount
        ) {

            highestExpense = expense;

        }

    });

    // Largest Category

    const categoryTotals = {};

    expenses.forEach(expense => {

        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) +
            Number(expense.amount);

    });

    let topCategory = "-";
    let topValue = 0;

    for (let category in categoryTotals) {

        if (categoryTotals[category] > topValue) {

            topValue = categoryTotals[category];
            topCategory = category;

        }

    }

    const budget = 40000;

    const budgetPercent =
        ((totalExpense / budget) * 100).toFixed(0);

    const data = [

        `🔥 Highest Expense: ${highestExpense ? highestExpense.title : "-"} (${highestExpense ? formatMoney(highestExpense.amount) : "₹0"})`,

        `📂 Top Category: ${topCategory} (${formatMoney(topValue)})`,

        `💸 Budget Used: ${budgetPercent}%`,

        `📈 Income Transactions: ${incomes.length}`,

        `📉 Expense Transactions: ${expenses.length}`,

        `💰 Current Balance: ${formatMoney(totalIncome - totalExpense)}`

    ];

    data.forEach(text => {

        const li = document.createElement("li");

        li.textContent = text;

        insights.appendChild(li);

    });

}


// ---------- SUMMARY CARDS ----------

  function updateSummaryCards() {

    let totalIncome = 0;
    let totalExpense = 0;
    let highest = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            totalIncome += Number(transaction.amount);

        } else {

            totalExpense += Number(transaction.amount);

            if (Number(transaction.amount) > highest) {
                highest = Number(transaction.amount);
            }

        }

    });

    const balance = totalIncome - totalExpense;
    updateBudgetTracker(totalExpense);
    updateInsights(totalIncome, totalExpense);
    renderActivityTimeline();

    if (balanceAmount)
    animateValue(balanceAmount, 0, balance);

if (incomeAmount)
    animateValue(incomeAmount, 0, totalIncome);

if (expenseAmountCard)
    animateValue(expenseAmountCard, 0, totalExpense);

if (savingsAmount)
    animateValue(savingsAmount, 0, balance);

if (highestExpense)
    animateValue(highestExpense, 0, highest);

if (totalTransactions)
    totalTransactions.textContent = transactions.length;
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

    type: document.getElementById("transactionType").value,

    date: transactionDate.value

};

    if (!expense.title) {

        showToast("Please enter a transaction name.");

        return;

    }

    if (expense.amount <= 0) {

        showToast("Please enter a valid amount.");

        return;

    }

    if (!expense.date) {

       showToast("Please select a date.");

        return;

    }

    try {

        let response;

        if (editId) {

           response = await fetch(

    `${API_URL}/expenses/${editId}`,

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

    `${API_URL}/expenses`,
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
        showToast(
    editId
        ? "✅ Transaction updated successfully!"
        : "✅ Transaction added successfully!"
);

    } catch (error) {

        console.error(error);

        showToast("❌ Unable to save transaction.");

    }

});

// ---------- DELETE ----------

async function deleteTransaction(id) {

    if (!confirm("Delete this expense?")) return;

    try {

       const response = await fetch(

    `${API_URL}/expenses/${id}`,
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
        showToast("🗑️ Transaction deleted successfully!");

    } catch (error) {

        console.error(error);

        showToast("❌ Unable to delete transaction.");

    }

}

// ---------- EDIT ----------

function editTransaction(id) {

    const transaction = transactions.find(

        t => t._id === id

    );

    if (!transaction) return;

    editId = id;

    // Transaction Name
    expenseName.value = transaction.title;

    // Category
    expenseCategory.value = transaction.category;

    // Amount
    expenseAmount.value = transaction.amount;

    // Date
    transactionDate.value =
        new Date(transaction.date)
            .toISOString()
            .split("T")[0];

    // Income / Expense Type
    const transactionType =
        document.getElementById("transactionType");

    if (transactionType) {

        transactionType.value =
            transaction.type || "expense";

    }

    // Open Modal
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
if (expenseBtn) {

    expenseBtn.addEventListener("click", () => {

        showSection("dashboard");

        renderTransactions();

        setActive(expenseBtn);

    });

}

if (incomeBtn) {

    incomeBtn.addEventListener("click", () => {

        showSection("dashboard");

        setActive(incomeBtn);

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
function renderCategoryChart() {

    const canvas = document.getElementById("categoryChart");

    if (!canvas) return;

    if (categoryChart)
        categoryChart.destroy();

    const categoryTotals = {};

    transactions
        .filter(transaction => transaction.type === "expense")
        .forEach(transaction => {

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

                data: Object.values(categoryTotals),

                backgroundColor: [

                    "#4F46E5",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#06B6D4",
                    "#8B5CF6",
                    "#EC4899",
                    "#84CC16"

                ],

                borderWidth: 0

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        padding: 20,

                        font: {

                            size: 13

                        }

                    }

                }

            }

        }

    });

}
// ==========================================
// CHUNK 6
// ANALYTICS CHARTS
// ==========================================

// ---------- INCOME vs EXPENSE ----------

function renderIncomeExpenseChart() {

    const canvas = document.getElementById("incomeExpenseChart");

    if (!canvas) return;

    if (incomeExpenseChart)
        incomeExpenseChart.destroy();

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        } else {

            expense += Number(transaction.amount);

        }

    });

    incomeExpenseChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{

                data: [income, expense],

                backgroundColor: [

                    "#10B981",
                    "#EF4444"

                ],

                borderColor: "#ffffff",

                borderWidth: 4,

                hoverOffset: 15

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        padding: 20,

                        font: {

                            size: 13

                        }

                    }

                }

            }

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

    transactions
        .filter(t => t.type === "expense")
        .forEach(transaction => {

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

                data: Object.values(categoryTotals),

                backgroundColor: [

                    "#4F46E5",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#06B6D4",
                    "#8B5CF6",
                    "#EC4899",
                    "#84CC16"

                ],

                borderColor: "#ffffff",

                borderWidth: 3

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        padding: 18,

                        font: {

                            size: 13

                        }

                    }

                }

            }

        }

    });

}

// ---------- MONTHLY CHART ----------

function renderMonthlyChart() {

    const canvas = document.getElementById("monthlyChart");

    if (!canvas) return;

    if (monthlyChart)
        monthlyChart.destroy();

    const monthlyIncome = {};
    const monthlyExpense = {};

    transactions.forEach(transaction => {

        const month = new Date(transaction.date)
            .toLocaleString("default", {
                month: "short"
            });

        if (transaction.type === "income") {

            monthlyIncome[month] =
                (monthlyIncome[month] || 0) +
                Number(transaction.amount);

        } else {

            monthlyExpense[month] =
                (monthlyExpense[month] || 0) +
                Number(transaction.amount);

        }

    });

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    monthlyChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: months,

            datasets: [

                {

                    label: "Income",

                    data: months.map(m => monthlyIncome[m] || 0),

                    backgroundColor: "#10B981",

                    borderRadius: 10

                },

                {

                    label: "Expense",

                    data: months.map(m => monthlyExpense[m] || 0),

                    backgroundColor: "#EF4444",

                    borderRadius: 10

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    position: "top"

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

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

            showToast("No transactions available to export.");

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

    `${API_URL}/expenses/${transaction._id}`,
                    {

                        method: "DELETE",

                        headers: {

                            Authorization: `Bearer ${token}`

                        }

                    }

                );

            }

            await loadTransactions();

            showToast("🗑️ All transactions deleted.");

        } catch (error) {

            console.error(error);

            showToast("❌ Unable to delete transactions.");

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
// ==========================================
// DARK / LIGHT MODE
// ==========================================

const themeToggle = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");

// Apply saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    if (themeToggle) themeToggle.textContent = "☀️";

    if (themeText) themeText.textContent = "Light Mode";

}

// Toggle theme
if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark = document.body.classList.contains("dark");

        if (isDark) {

            themeToggle.textContent = "☀️";

            if (themeText) themeText.textContent = "Light Mode";

            localStorage.setItem("theme", "dark");

        } else {

            themeToggle.textContent = "🌙";

            if (themeText) themeText.textContent = "Dark Mode";

            localStorage.setItem("theme", "light");

        }

    });

}

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
// ==========================
// SAVE MONTHLY BUDGET
// ==========================

if (saveBudgetBtn) {

    budgetInput.value =
        localStorage.getItem("monthlyBudget") || 40000;

    saveBudgetBtn.addEventListener("click", () => {

        const value = Number(budgetInput.value);

        if (value <= 0) {

            alert("Please enter a valid budget.");

            return;

        }

        localStorage.setItem("monthlyBudget", value);

        document.getElementById("budgetLimit").textContent =
            formatMoney(value);

        updateSummaryCards();

        alert("Monthly budget updated!");

    });

}