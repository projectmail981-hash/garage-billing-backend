const db = require("../config/db");

// Get all job services
const getAllJobServices = (callback) => {
    const sql = `
    SELECT
        job_service_id,
        job_id,
        service_name,
        quantity,
        labour_charge,
        total_amount,
        is_completed
    FROM job_services
    ORDER BY job_service_id DESC
    `;
    db.query(sql, callback);
};

// Get services by Job ID
const getJobServicesByJobId = (jobId, callback) => {
    const sql = `
    SELECT
        job_service_id,
        job_id,
        service_name,
        quantity,
        labour_charge,
        total_amount,
        is_completed
    FROM job_services
    WHERE job_id = ?
    `;
    db.query(sql, [jobId], callback);
};

// Add Job Service
const addJobService = (service, callback) => {
    const totalAmount =
        service.total_amount != null
            ? service.total_amount
            : service.quantity * service.labour_charge;

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
            service.job_id,
            service.service_name,
            service.quantity,
            service.labour_charge,
            totalAmount,
            false
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

// Toggle Job Service Status
const toggleJobServiceStatus = (id, isCompleted, callback) => {
    const sql = `
    UPDATE job_services
    SET is_completed = ?
    WHERE job_service_id = ?
    `;
    db.query(sql, [isCompleted, id], callback);
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
    toggleJobServiceStatus,
    deleteJobService
};
