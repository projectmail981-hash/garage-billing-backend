const db = require("../config/db");

// Get all services
const getAllServices = (callback) => {
    db.query("SELECT * FROM services ORDER BY service_id DESC", callback);
};

// Get service by ID
const getServiceById = (id, callback) => {
    db.query(
        "SELECT * FROM services WHERE service_id=?",
        [id],
        callback
    );
};

// Add service
const addService = (service, callback) => {

    const sql = `
    INSERT INTO services
    (service_name, description, labour_charge)
    VALUES(?,?,?)
    `;

    db.query(sql,
        [
            service.service_name,
            service.description,
            service.labour_charge
        ],
        callback
    );
};

// Update service
const updateService = (id, service, callback) => {

    const sql = `
    UPDATE services
    SET service_name=?,
        description=?,
        labour_charge=?
    WHERE service_id=?
    `;

    db.query(sql,
        [
            service.service_name,
            service.description,
            service.labour_charge,
            id
        ],
        callback
    );
};

// Delete service
const deleteService = (id, callback) => {
    db.query(
        "DELETE FROM services WHERE service_id=?",
        [id],
        callback
    );
};

module.exports = {
    getAllServices,
    getServiceById,
    addService,
    updateService,
    deleteService
};