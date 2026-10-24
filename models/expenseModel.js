const db = require("../config/db");

const getExpenses = async (callback) => {
    // Total purchased quantity for each inventory item is:
    // remaining stock (GREATEST(i.stock_quantity, 0)) + quantity used in job_parts (COALESCE(jp.used_qty, 0))
    const listSql = `
    SELECT
        i.part_id,
        i.part_name,
        i.category,
        (GREATEST(i.stock_quantity, 0) + COALESCE(jp.used_qty, 0)) AS stock_quantity,
        i.unit_price,
        i.supplier,
        COALESCE(i.created_at, i.date::timestamptz) AS created_at,
        i.date,
        (i.unit_price * (GREATEST(i.stock_quantity, 0) + COALESCE(jp.used_qty, 0))) AS total_expense
    FROM inventory i
    LEFT JOIN (
        SELECT part_id, SUM(quantity) AS used_qty
        FROM job_parts
        WHERE part_id IS NOT NULL
        GROUP BY part_id
    ) jp ON i.part_id = jp.part_id
    ORDER BY COALESCE(i.created_at, i.date::timestamptz) DESC, i.part_id DESC
    `;

    // Weekly expenses reset on Monday 00:00:00 (Asia/Kolkata)
    // Monthly expenses reset on the 1st of the month 00:00:00 (Asia/Kolkata)
    const sql = `
    WITH item_expenses AS (
        SELECT
            COALESCE(i.created_at, i.date::timestamptz) AS item_date,
            (i.unit_price * (GREATEST(i.stock_quantity, 0) + COALESCE(jp.used_qty, 0))) AS total_expense
        FROM inventory i
        LEFT JOIN (
            SELECT part_id, SUM(quantity) AS used_qty
            FROM job_parts
            WHERE part_id IS NOT NULL
            GROUP BY part_id
        ) jp ON i.part_id = jp.part_id
    )
    SELECT
        COALESCE(SUM(
            CASE
                WHEN (item_date AT TIME ZONE 'Asia/Kolkata') >= DATE_TRUNC('week', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')
                THEN total_expense
                ELSE 0
            END
        ), 0) AS "weeklyExpenses",
        COALESCE(SUM(
            CASE
                WHEN (item_date AT TIME ZONE 'Asia/Kolkata') >= DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')
                THEN total_expense
                ELSE 0
            END
        ), 0) AS "monthlyExpenses"
    FROM item_expenses
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
