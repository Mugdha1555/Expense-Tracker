// ==========================================
// SAMPLE DATA
// ==========================================

let transactions = [

    {
        id: 1,
        name: "Salary",
        category: "Income",
        amount: 40000,
        type: "income"
    },

    {
        id: 2,
        name: "Netflix",
        category: "Entertainment",
        amount: 499,
        type: "expense"
    },

    {
        id: 3,
        name: "Groceries",
        category: "Food",
        amount: 1200,
        type: "expense"
    }

];

// ==========================================
// DOM ELEMENTS
// ==========================================

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
const expenseAmount = document.getElementById("expenseAmount");

// ==========================================
// RENDER DASHBOARD
// ==========================================

function renderDashboard() {

    transactionBody.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction, index) => {

        const row = document.createElement("tr");

        const amountColor =
            transaction.type === "income"
            ? "#22C55E"
            : "#EF4444";

        row.innerHTML = `
            <td>${transaction.name}</td>
            <td>${transaction.category}</td>
            <td style="color:${amountColor};font-weight:600;">
                ₹${transaction.amount.toLocaleString()}
            </td>
            <td>
                <button
                    class="delete-btn"
                    data-index="${index}"
                >
                    🗑 Delete
                </button>
            </td>
        `;

        transactionBody.appendChild(row);

        if(transaction.type==="income"){

            income += transaction.amount;

        }else{

            expense += transaction.amount;

        }

    });

    balanceAmount.textContent =
        `₹${(income-expense).toLocaleString()}`;

    incomeAmount.textContent =
        `₹${income.toLocaleString()}`;

    expenseAmountCard.textContent =
        `₹${expense.toLocaleString()}`;
}

// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(index){

    transactions.splice(index,1);

    renderDashboard();

}

// ==========================================
// EVENT DELEGATION FOR DELETE BUTTONS
// ==========================================

transactionBody.addEventListener("click",function(e){

    if(e.target.classList.contains("delete-btn")){

        const index = e.target.dataset.index;

        deleteTransaction(index);

    }

});

// ==========================================
// MODAL FUNCTIONS
// ==========================================

showFormBtn.addEventListener("click",function(){

    modalOverlay.classList.add("active");

});

closeModal.addEventListener("click",function(){

    modalOverlay.classList.remove("active");

});

modalOverlay.addEventListener("click",function(e){

    if(e.target===modalOverlay){

        modalOverlay.classList.remove("active");

    }

});

// ==========================================
// ADD EXPENSE
// ==========================================

expenseForm.addEventListener("submit",function(e){

    e.preventDefault();

    const name=expenseName.value.trim();

    const category=expenseCategory.value;

    const amount=Number(expenseAmount.value);

    if(name==="" || amount<=0){

        alert("Please enter valid details.");

        return;

    }

    const newTransaction={

        id:Date.now(),

        name:name,

        category:category,

        amount:amount,

        type:"expense"

    };

    transactions.push(newTransaction);

    renderDashboard();

    expenseForm.reset();

    modalOverlay.classList.remove("active");

});

// ==========================================
// INITIAL LOAD
// ==========================================

renderDashboard();