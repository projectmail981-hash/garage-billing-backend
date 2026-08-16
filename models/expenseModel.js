const db = require("../config/db");

const getExpenses = async (callback) => {
    const sql = `
    SELECT
    (
        SELECT IFNULL(SUM(unit_price * stock_quantity), 0)
        FROM inventory
        WHERE WEEK(created_at) = WEEK(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    ) AS weeklyExpenses,
    (
        SELECT IFNULL(SUM(unit_price * stock_quantity), 0)
        FROM inventory
        WHERE MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    ) AS monthlyExpenses
    `;

    const listSql = `
    SELECT part_id, part_name, category, stock_quantity, unit_price, supplier, created_at, (unit_price * stock_quantity) as total_expense
    FROM inventory
    ORDER BY created_at DESC
    `;

    try {
        const promisePool = db.promise();
        const [
            [summaryRows],
            [items]
        ] = await Promise.all([
            promisePool.query(sql),
            promisePool.query(listSql)
        ]);

        callback(null, {
            summary: summaryRows[0],
            items
        });
    } catch (err) {
        callback(err);
    }
};

module.exports = {
    getExpenses
};
