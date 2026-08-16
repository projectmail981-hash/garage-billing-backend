const Expense = require("../models/expenseModel");

exports.getExpenses = (req, res) => {
    Expense.getExpenses((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
