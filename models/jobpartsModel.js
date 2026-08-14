const db = require("../config/db");

// Get All Job Parts
const getAllJobParts = (callback) => {
    const sql = `
    SELECT
        jp.job_part_id,
        jp.job_id,
        COALESCE(i.part_name, jp.part_name) AS part_name,
        jp.quantity,
        jp.unit_price,
        jp.total_amount,
        jp.is_completed
    FROM job_parts jp
    LEFT JOIN inventory i
    ON jp.part_id = i.part_id
    ORDER BY jp.job_part_id DESC
    `;
    db.query(sql, callback);
};

// Get Parts by Job ID
const getJobPartsByJobId = (jobId, callback) => {
    const sql = `
    SELECT
        jp.job_part_id,
        jp.job_id,
        COALESCE(i.part_name, jp.part_name) AS part_name,
        jp.quantity,
        jp.unit_price,
        jp.total_amount,
        jp.is_completed
    FROM job_parts jp
    LEFT JOIN inventory i
    ON jp.part_id = i.part_id
    WHERE jp.job_id = ?
    `;
    db.query(sql, [jobId], callback);
};

// Add Job Part
const addJobPart = (part, callback) => {
    const totalAmount =
        part.quantity * part.unit_price;

    const sql = `
    INSERT INTO job_parts
    (
        job_id,
        part_id,
        part_name,
        quantity,
        unit_price,
        total_amount,
        is_completed
    )
    VALUES (?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            part.job_id,
            part.part_id,
            part.part_name,
            part.quantity,
            part.unit_price,
            totalAmount,
            false
        ],
        (err, result) => {
            if (err) return callback(err);

            if (part.part_id) {
                const stockSql = "UPDATE inventory SET stock_quantity = stock_quantity - ? WHERE part_id = ?";
                db.query(stockSql, [part.quantity, part.part_id], (err2) => {
                    if (err2) console.error("Failed to update stock", err2);
                    callback(null, result);
                });
            } else {
                callback(null, result);
            }
        }
    );
};

// Update Job Part
const updateJobPart = (id, part, callback) => {
    const totalAmount =
        part.quantity * part.unit_price;

    const sql = `
    UPDATE job_parts
    SET
        quantity=?,
        unit_price=?,
        total_amount=?
    WHERE job_part_id=?
    `;

    db.query(
        sql,
        [
            part.quantity,
            part.unit_price,
            totalAmount,
            id
        ],
        callback
    );
};

// Toggle Job Part Status
const toggleJobPartStatus = (id, isCompleted, callback) => {
    const sql = `
    UPDATE job_parts
    SET is_completed = ?
    WHERE job_part_id = ?
    `;
    db.query(sql, [isCompleted, id], callback);
};

// Delete Job Part
const deleteJobPart = (id, callback) => {
    // First, fetch the part to get its part_id and quantity so we can restore stock
    db.query("SELECT part_id, quantity FROM job_parts WHERE job_part_id=?", [id], (err, results) => {
        if (err || results.length === 0) {
            // Proceed to delete anyway if fetch fails
            db.query("DELETE FROM job_parts WHERE job_part_id=?", [id], callback);
            return;
        }

        const part = results[0];
        
        db.query("DELETE FROM job_parts WHERE job_part_id=?", [id], (delErr) => {
            if (delErr) return callback(delErr);

            if (part.part_id) {
                const stockSql = "UPDATE inventory SET stock_quantity = stock_quantity + ? WHERE part_id = ?";
                db.query(stockSql, [part.quantity, part.part_id], (err2) => {
                    if (err2) console.error("Failed to restore stock", err2);
                    callback(null);
                });
            } else {
                callback(null);
            }
        });
    });
};

module.exports = {
    getAllJobParts,
    getJobPartsByJobId,
    addJobPart,
    updateJobPart,
    toggleJobPartStatus,
    deleteJobPart
};