const db = require("../config/db");

// Get All Job Parts
const getAllJobParts = (callback) => {

    const sql = `
    SELECT
        jp.job_part_id,
        jp.job_id,
        i.part_name,
        jp.quantity,
        jp.unit_price,
        jp.total_amount
    FROM job_parts jp
    JOIN inventory i
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
        i.part_name,
        jp.quantity,
        jp.unit_price,
        jp.total_amount
    FROM job_parts jp
    JOIN inventory i
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
        quantity,
        unit_price,
        total_amount
    )
    VALUES (?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            part.job_id,
            part.part_id,
            part.quantity,
            part.unit_price,
            totalAmount
        ],
        callback
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

// Delete Job Part
const deleteJobPart = (id, callback) => {

    const sql =
    "DELETE FROM job_parts WHERE job_part_id=?";

    db.query(sql, [id], callback);

};

module.exports = {

    getAllJobParts,
    getJobPartsByJobId,
    addJobPart,
    updateJobPart,
    deleteJobPart

};