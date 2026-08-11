const db = require("../config/db");

// Get All Invoices
const getAllInvoices = (callback) => {

    const sql = `
    SELECT
        i.invoice_id,
        i.invoice_number,
        i.invoice_date,
        i.subtotal,
        i.tax,
        i.total_amount,
        i.paid_amount,
        i.balance_amount,
        i.status,

        j.job_id,

        c.customer_name,

        v.vehicle_number

    FROM invoices i

    JOIN job_cards j
        ON i.job_id = j.job_id

    JOIN customers c
        ON j.customer_id = c.customer_id

    JOIN vehicles v
        ON j.vehicle_id = v.vehicle_id

    ORDER BY i.invoice_id DESC
    `;

    db.query(sql, callback);

};

// Get Invoice By ID
const getInvoiceById = (id, callback) => {

    const sql = `
    SELECT
        i.invoice_id,
        i.job_id,
        i.invoice_number,
        i.invoice_date,
        i.subtotal,
        i.tax,
        i.total_amount,
        i.paid_amount,
        i.balance_amount,
        i.status,

        c.customer_name,
        c.phone,

        v.vehicle_number,
        v.brand,
        v.model,

        j.odometer_reading

    FROM invoices i

    JOIN job_cards j
        ON i.job_id = j.job_id

    JOIN customers c
        ON j.customer_id = c.customer_id

    JOIN vehicles v
        ON j.vehicle_id = v.vehicle_id

    WHERE i.invoice_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err)
            return callback(err);

        if (result.length === 0)
            return callback(null, []);

        const invoice = result[0];

        const serviceSql = `
        SELECT
            job_service_id,
            service_name,
            quantity,
            labour_charge,
            total_amount
        FROM job_services
        WHERE job_id = ?
        `;

        db.query(serviceSql, [invoice.job_id], (err, services) => {

            if (err)
                return callback(err);

            const partSql = `
            SELECT
                job_part_id,
                part_name,
                quantity,
                unit_price,
                total_amount
            FROM job_parts
            WHERE job_id = ?
            `;

            db.query(partSql, [invoice.job_id], (err, parts) => {

                if (err)
                    return callback(err);

                invoice.services = services || [];
                invoice.parts = parts || [];

                callback(null, [invoice]);

            });

        });

    });

};

// Create Invoice
const createInvoice = (invoice, callback) => {

    const labourSql = `
    SELECT IFNULL(SUM(total_amount),0) AS labourTotal
    FROM job_services
    WHERE job_id = ?
    `;

    db.query(labourSql, [invoice.job_id], (err, labourResult) => {

        if (err)
            return callback(err);

        const labourTotal =
            Number(labourResult[0].labourTotal);

        const partsSql = `
        SELECT IFNULL(SUM(total_amount),0) AS partsTotal
        FROM job_parts
        WHERE job_id = ?
        `;

        db.query(partsSql, [invoice.job_id], (err, partsResult) => {

            if (err)
                return callback(err);

            const partsTotal =
                Number(partsResult[0].partsTotal);

            const subtotal =
                labourTotal + partsTotal;

            const tax =
                Number(invoice.tax || 0);

            const totalAmount =
                subtotal + tax;

            const paidAmount =
                Number(invoice.paid_amount || 0);

            const balanceAmount =
                totalAmount - paidAmount;

            let status = "Unpaid";

            if (balanceAmount === 0)
                status = "Paid";
            else if (paidAmount > 0)
                status = "Partial";

            const invoiceNumber =
                "INV-" + Date.now();

            const sql = `
            INSERT INTO invoices
            (
                job_id,
                invoice_number,
                invoice_date,
                subtotal,
                tax,
                total_amount,
                paid_amount,
                balance_amount,
                status
            )
            VALUES (?,?,?,?,?,?,?,?,?)
            `;

            db.query(
                sql,
                [
                    invoice.job_id,
                    invoiceNumber,
                    new Date(),
                    subtotal,
                    tax,
                    totalAmount,
                    paidAmount,
                    balanceAmount,
                    status
                ],
                callback
            );

        });

    });

};

const receivePayment = (invoiceId, payment, callback) => {

    const getSql = `
    SELECT
        total_amount,
        paid_amount
    FROM invoices
    WHERE invoice_id = ?
    `;

    db.query(getSql, [invoiceId], (err, result) => {

        if (err)
            return callback(err);

        if (result.length === 0)
            return callback(new Error("Invoice Not Found"));

        const totalAmount = Number(result[0].total_amount);

        const currentPaid = Number(result[0].paid_amount);

        const newPayment = Number(payment.amount);

        const updatedPaid = currentPaid + newPayment;

        const balance = totalAmount - updatedPaid;

        let status = "Unpaid";

        if (updatedPaid <= 0)
            status = "Unpaid";
        else if (balance > 0)
            status = "Partial";
        else
            status = "Paid";

        const updateSql = `
        UPDATE invoices
        SET
            paid_amount = ?,
            balance_amount = ?,
            status = ?
        WHERE invoice_id = ?
        `;

        db.query(
            updateSql,
            [
                updatedPaid,
                balance,
                status,
                invoiceId
            ],
            callback
        );

    });

};

const searchInvoice = (keyword, callback) => {

    const sql = `

    SELECT

        i.*,

        c.customer_name,

        v.vehicle_number

    FROM invoices i

    JOIN job_cards j
        ON i.job_id=j.job_id

    JOIN customers c
        ON j.customer_id=c.customer_id

    JOIN vehicles v
        ON j.vehicle_id=v.vehicle_id

    WHERE

        i.invoice_number LIKE ?

        OR

        c.customer_name LIKE ?

        OR

        v.vehicle_number LIKE ?

    `;

    const search = "%" + keyword + "%";

    db.query(

        sql,

        [

            search,
            search,
            search

        ],

        callback

    );

};

// Update Invoice Payment
const updateInvoice = (id, invoice, callback) => {

    const balanceAmount =
        invoice.total_amount - invoice.paid_amount;

    let status = "Unpaid";

    if (balanceAmount === 0)
        status = "Paid";
    else if (invoice.paid_amount > 0)
        status = "Partial";

    const sql = `
    UPDATE invoices
    SET
        paid_amount=?,
        balance_amount=?,
        status=?
    WHERE invoice_id=?
    `;

    db.query(
        sql,
        [
            invoice.paid_amount,
            balanceAmount,
            status,
            id
        ],
        callback
    );

};

// Delete Invoice
const deleteInvoice = (id, callback) => {

    const sql =
        "DELETE FROM invoices WHERE invoice_id=?";

    db.query(sql, [id], callback);

};

module.exports = {

    getAllInvoices,
    searchInvoice,
    receivePayment,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice

};