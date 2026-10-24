const db = require("../config/db");

const getExpenses = async (callback) => {
    const sql = `
    SELECT
    (
        SELECT COALESCE(SUM(unit_price * stock_quantity), 0)
        FROM inventory
        WHERE EXTRACT(WEEK FROM created_at) = EXTRACT(WEEK FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) AS "weeklyExpenses",
    (
        SELECT COALESCE(SUM(unit_price * stock_quantity), 0)
        FROM inventory
        WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) AS "monthlyExpenses"
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
