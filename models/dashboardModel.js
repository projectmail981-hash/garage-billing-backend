const db = require("../config/db");

// Dashboard Summary
const getDashboard = (callback) => {

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
        SELECT IFNULL(SUM(total_amount),0)
        FROM job_parts
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
console.log("Dashboard Query");

db.query(sql, (err, dashboard) => {
console.log("Dashboard Done");

    if (err) return callback(err);
     console.log("Recent Query");

    db.query(recentSql, (err, recentInvoices) => {
console.log("Recent Done");
        if (err) return callback(err);
console.log("Pending Query");
        db.query(pendingSql, (err, pendingInvoices) => {
 console.log("Pending Done");
            if (err) return callback(err);
console.log("Sending Response");
            callback(null, {
                ...dashboard[0],
                recentInvoices,
                pendingInvoices
            });

        });

    });

});

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