const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getDashboardData = async (req, res) => {

    try {

        const userId = req.user._id;

        const expenses = await Expense.find({ user: userId });

        const incomes = await Income.find({ user: userId });

        const totalExpense = expenses.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        const totalIncome = incomes.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        const balance = totalIncome - totalExpense;

        const recentExpenses = expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const recentIncome = incomes
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        res.json({

            balance,

            totalIncome,

            totalExpense,

            recentExpenses,

            recentIncome

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getDashboardData

};