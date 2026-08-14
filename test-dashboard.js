const db = require('./config/db');
require('dotenv').config();

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
    
db.query(sql, (err, result) => {
    if (err) console.error("Query Error:", err);
    else console.log("Success:", result);
    process.exit();
});
