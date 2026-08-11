const db = require("../config/db");

// Get all vehicles
const getAllVehicles = (callback) => {
    db.query("SELECT * FROM vehicles ORDER BY vehicle_id DESC", callback);
};

// Get vehicle by ID
const getVehicleById = (id, callback) => {
    db.query(
        "SELECT * FROM vehicles WHERE vehicle_id=?",
        [id],
        callback
    );
};

// Add vehicle
const addVehicle = (vehicle, callback) => {

    const sql = `
    INSERT INTO vehicles
    (
        customer_id,
        vehicle_number,
        vehicle_type,
        fuel_type,
        brand,
        model,
        manufacture_year
    )
    VALUES(?,?,?,?,?,?,?)
    `;

    db.query(sql,
        [
            vehicle.customer_id,
            vehicle.vehicle_number,
            vehicle.vehicle_type,
            vehicle.fuel_type,
            vehicle.brand,
            vehicle.model,
            vehicle.manufacture_year
        ],
        callback
    );
};

// Update vehicle
const updateVehicle = (id, vehicle, callback) => {

    const sql = `
    UPDATE vehicles
    SET
        vehicle_number=?,
        vehicle_type=?,
        fuel_type=?,
        brand=?,
        model=?,
        manufacture_year=?
    WHERE vehicle_id=?
    `;

    db.query(sql,
        [
            vehicle.vehicle_number,
            vehicle.vehicle_type,
            vehicle.fuel_type,
            vehicle.brand,
            vehicle.model,
            vehicle.manufacture_year,
            id
        ],
        callback
    );
};

// Delete vehicle
const deleteVehicle = (id, callback) => {

    db.query(
        "DELETE FROM vehicles WHERE vehicle_id=?",
        [id],
        callback
    );

};

const searchVehicle = (vehicleNumber, callback) => {

    const sql = `
    SELECT

        c.customer_id,
        c.customer_name,
        c.phone,

        v.vehicle_id,
        v.vehicle_number,
        v.brand,
        v.model,
        v.fuel_type

    FROM vehicles v

    JOIN customers c

    ON c.customer_id = v.customer_id

    WHERE v.vehicle_number = ?
    `;

    db.query(sql, [vehicleNumber], callback);

};

const getVehiclesByCustomer = (customerId, callback) => {

    const sql = `
        SELECT *
        FROM vehicles
        WHERE customer_id = ?
        ORDER BY vehicle_id DESC
    `;

    db.query(sql, [customerId], callback);

};

module.exports = {

    getAllVehicles,
    getVehicleById,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    searchVehicle,
    getVehiclesByCustomer

};