const db = require("../config/db");

// Get all job cards
const getAllJobCards = (callback) => {

    const sql = `
    SELECT
        jc.*,
        c.customer_name,
        v.vehicle_number
    FROM job_cards jc
    JOIN customers c
        ON jc.customer_id = c.customer_id
    JOIN vehicles v
        ON jc.vehicle_id = v.vehicle_id
    ORDER BY jc.job_id DESC
    `;

    db.query(sql, callback);

};

// Get job card by ID
const getJobCardById = (id, callback) => {

    const jobSql = `
    SELECT
        jc.*,
        c.customer_name,
        c.phone,
        v.vehicle_number,
        v.brand,
        v.model
    FROM job_cards jc
    JOIN customers c
        ON jc.customer_id = c.customer_id
    JOIN vehicles v
        ON jc.vehicle_id = v.vehicle_id
    WHERE jc.job_id = ?
    `;

    db.query(jobSql, [id], (err, jobResult) => {

        if (err)
            return callback(err);

        if (jobResult.length === 0)
            return callback(null, []);

        const job = jobResult[0];

        const serviceSql = `
        SELECT
            job_service_id,
            service_name,
            quantity,
            labour_charge,
            total_amount,
            is_completed
        FROM job_services
        WHERE job_id = ?
        `;

        db.query(serviceSql, [id], (err, services) => {

            if (err)
                return callback(err);

            const partSql = `
            SELECT
                job_part_id,
                part_name,
                quantity,
                unit_price,
                total_amount,
                is_completed
            FROM job_parts
            WHERE job_id = ?
            `;

            db.query(partSql, [id], (err, parts) => {

                if (err)
                    return callback(err);

                job.services = services;
                job.parts = parts;

                callback(null, [job]);

            });

        });

    });

};
// Create job card
const createJobCard = (job, callback) => {

    const sql = `
    INSERT INTO job_cards
    (
        customer_id,
        vehicle_id,
        service_date,
        odometer_reading,
        status,
        notes
    )
    VALUES (?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            job.customer_id,
            job.vehicle_id,
            job.service_date,
            job.odometer_reading,
            job.status,
            job.notes
        ],
        (err, result) => {

            if (err)
                return callback(err);

            callback(null, {

                job_id: result.insertId

            });

        }
    );

};

const addJobService = (jobId, service, callback) => {
    const sql = `
    INSERT INTO job_services
    (
        job_id,
        service_name,
        quantity,
        labour_charge,
        total_amount,
        is_completed
    )
    VALUES (?,?,?,?,?,?)
    `;
    db.query(
        sql,
        [
            jobId,
            service.service_name,
            service.quantity,
            service.labour_charge,
            service.total_amount,
            false
        ],
        callback
    );
};

const addJobPart = (jobId, part, callback) => {
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
            jobId,
            part.part_id,
            part.part_name,
            part.quantity,
            part.unit_price,
            part.total_amount,
            false
        ],
        (err, result) => {
            if (err) return callback(err);

            if (part.part_id) {
                const stockSql = "UPDATE inventory SET stock_quantity = stock_quantity - ? WHERE part_id = ?";
                db.query(stockSql, [part.quantity, part.part_id], (err2) => {
                    if (err2) console.error("Failed to deduct stock during job creation", err2);
                    callback(null, result);
                });
            } else {
                callback(null, result);
            }
        }
    );
};

const searchJobCards = (keyword, callback) => {

    const search = "%" + keyword + "%";

    const sql = `

    SELECT

        j.*,

        c.customer_name,

        v.vehicle_number

    FROM job_cards j

    JOIN customers c
        ON j.customer_id = c.customer_id

    JOIN vehicles v
        ON j.vehicle_id = v.vehicle_id

    WHERE

        c.customer_name LIKE ?

        OR

        v.vehicle_number LIKE ?

        OR

        j.status LIKE ?

    ORDER BY j.job_id DESC

    `;

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

// Update
const updateJobCard = (id, job, callback) => {

    const sql = `
        UPDATE job_cards
        SET status = ?
        WHERE job_id = ?
    `;

    db.query(
        sql,
        [
            job.status,
            id
        ],
        callback
    );

};

// Delete
const deleteJobCard = (id, callback) => {

    db.query(
        "DELETE FROM job_cards WHERE job_id=?",
        [id],
        callback
    );

};

module.exports = {

    getAllJobCards,
    getJobCardById,
    createJobCard,
    addJobService,
    addJobPart,
    updateJobCard,
    deleteJobCard,
    searchJobCards

};