const db = require("../config/db");

// Dashboard Summary
const getDashboard = async (callback) => {

    const sql = `
    SELECT

    (
        SELECT IFNULL(SUM(total_amount),0)
        FROM invoices
        WHERE WEEK(invoice_date)=WEEK(CURDATE())
        AND YEAR(invoice_date)=YEAR(CURDATE())
    ) AS weekRevenue,

    (
        SELECT IFNULL(SUM(total_amount),0)
        FROM invoices
        WHERE MONTH(invoice_date)=MONTH(CURDATE())
        AND YEAR(invoice_date)=YEAR(CURDATE())
    ) AS monthRevenue,

    (
        SELECT IFNULL(SUM(total_amount),0)
        FROM job_services
    ) AS labourRevenue,

    (
        SELECT IFNULL(SUM(jp.quantity * (jp.unit_price - IFNULL(i.unit_price, jp.unit_price))), 0)
        FROM job_parts jp
        LEFT JOIN inventory i ON jp.part_id = i.part_id
    ) AS partsRevenue,

    (
        SELECT COUNT(*)
        FROM job_cards
        WHERE status='Open'
    ) AS activeJobs,

    (
        SELECT COUNT(*)
        FROM customers
    ) AS totalCustomers;
    `;

    const recentSql = `
SELECT
    i.invoice_id,
    i.invoice_number,
    i.invoice_date,
    i.total_amount,
    i.status,
    c.customer_name,
    v.vehicle_number
FROM invoices i
JOIN job_cards j
    ON i.job_id = j.job_id
JOIN customers c
    ON j.customer_id = c.customer_id
JOIN vehicles v
    ON j.vehicle_id = v.vehicle_id
ORDER BY i.invoice_date DESC
LIMIT 5
`;

const pendingSql = `
SELECT
    i.invoice_id,
    i.invoice_number,
    i.invoice_date,
    i.total_amount,
    i.balance_amount,
    i.status,
    c.customer_name,
    v.vehicle_number
FROM invoices i
JOIN job_cards j
    ON i.job_id = j.job_id
JOIN customers c
    ON j.customer_id = c.customer_id
JOIN vehicles v
    ON j.vehicle_id = v.vehicle_id
WHERE i.balance_amount > 0
ORDER BY i.invoice_date DESC
LIMIT 5
`;

const weeklyChartSql = `
SELECT DATE(invoice_date) as date, SUM(total_amount) as total
FROM invoices
WHERE WEEK(invoice_date)=WEEK(CURDATE()) AND YEAR(invoice_date)=YEAR(CURDATE())
GROUP BY DATE(invoice_date)
ORDER BY date ASC
`;

const monthlyChartSql = `
SELECT WEEK(invoice_date) as week, SUM(total_amount) as total
FROM invoices
WHERE MONTH(invoice_date)=MONTH(CURDATE()) AND YEAR(invoice_date)=YEAR(CURDATE())
GROUP BY WEEK(invoice_date)
ORDER BY week ASC
`;

console.log("Dashboard Query via Promise.all");

try {
    const promisePool = db.promise();
    
    const [
        [dashboardRows],
        [recentInvoices],
        [pendingInvoices],
        [weeklyChart],
        [monthlyChart]
    ] = await Promise.all([
        promisePool.query(sql),
        promisePool.query(recentSql),
        promisePool.query(pendingSql),
        promisePool.query(weeklyChartSql),
        promisePool.query(monthlyChartSql)
    ]);

    console.log("Sending Response");
    callback(null, {
        ...dashboardRows[0],
        recentInvoices,
        pendingInvoices,
        weeklyChart,
        monthlyChart
    });
} catch (err) {
    console.error("Dashboard Query Error:", err);
    callback(err);
}

};

const globalSearch = (keyword, callback) => {

    const search = "%" + keyword + "%";

    const sql = `

    SELECT

        c.customer_name,

        c.phone,

        v.vehicle_number,

        j.job_id,

        j.status,

        i.invoice_number

    FROM customers c

    JOIN vehicles v
        ON c.customer_id = v.customer_id

    LEFT JOIN job_cards j
        ON v.vehicle_id = j.vehicle_id

    LEFT JOIN invoices i
        ON j.job_id = i.job_id

    WHERE

        c.customer_name LIKE ?

        OR

        c.phone LIKE ?

        OR

        v.vehicle_number LIKE ?

        OR

        i.invoice_number LIKE ?

    LIMIT 10

    `;

    db.query(

        sql,

        [

            search,
            search,
            search,
            search

        ],

        callback

    );

};

module.exports = {

    getDashboard,
    globalSearch

};