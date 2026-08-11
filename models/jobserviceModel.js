const db = require("../config/db");

// Get all job services
const getAllJobServices = (callback) => {

    const sql = `
    SELECT
        js.job_service_id,
        js.job_id,
        s.service_name,
        js.quantity,
        js.labour_charge,
        js.total_amount
    FROM job_services js
    JOIN services s
    ON js.service_id = s.service_id
    ORDER BY js.job_service_id DESC
    `;

    db.query(sql, callback);
};

// Get services by Job ID
const getJobServicesByJobId = (jobId, callback) => {

    const sql = `
    SELECT
        js.job_service_id,
        js.job_id,
        s.service_name,
        js.quantity,
        js.labour_charge,
        js.total_amount
    FROM job_services js
    JOIN services s
    ON js.service_id = s.service_id
    WHERE js.job_id = ?
    `;

    db.query(sql, [jobId], callback);
};

// Add Job Service
const addJobService = (service, callback) => {

    const totalAmount =
        service.quantity * service.labour_charge;

    const sql = `
    INSERT INTO job_services
    (
        job_id,
        service_id,
        quantity,
        labour_charge,
        total_amount
    )
    VALUES (?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            service.job_id,
            service.service_id,
            service.quantity,
            service.labour_charge,
            totalAmount
        ],
        callback
    );
};

// Update Job Service
const updateJobService = (id, service, callback) => {

    const totalAmount =
        service.quantity * service.labour_charge;

    const sql = `
    UPDATE job_services
    SET
        quantity=?,
        labour_charge=?,
        total_amount=?
    WHERE job_service_id=?
    `;

    db.query(
        sql,
        [
            service.quantity,
            service.labour_charge,
            totalAmount,
            id
        ],
        callback
    );
};

// Delete Job Service
const deleteJobService = (id, callback) => {

    const sql =
    "DELETE FROM job_services WHERE job_service_id=?";

    db.query(sql, [id], callback);
};

module.exports = {

    getAllJobServices,
    getJobServicesByJobId,
    addJobService,
    updateJobService,
    deleteJobService

};