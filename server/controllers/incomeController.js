const Income = require("../models/Income");

// ================= Add Income =================

const addIncome = async (req, res) => {
    try {
        const { source, amount, date } = req.body;

        const income = await Income.create({
            user: req.user._id,
            source,
            amount,
            date,
        });

        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ================= Get Income =================

const getIncome = async (req, res) => {
    try {
        const incomes = await Income.find({
            user: req.user._id,
        }).sort({
            date: -1,
        });

        res.json(incomes);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ================= Update Income =================

const updateIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({
                message: "Income not found",
            });
        }

        if (income.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        income.source = req.body.source || income.source;
        income.amount = req.body.amount || income.amount;
        income.date = req.body.date || income.date;

        const updatedIncome = await income.save();

        res.json(updatedIncome);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ================= Delete Income =================

const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({
                message: "Income not found",
            });
        }

        if (income.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        await income.deleteOne();

        res.json({
            message: "Income deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome,
};