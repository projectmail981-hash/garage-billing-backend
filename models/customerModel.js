const db = require("../config/db");

// Get all customers
const getAllCustomers = (callback) => {
    const sql = "SELECT * FROM customers ORDER BY customer_id DESC";
    db.query(sql, callback);
};

// Get customer by ID
const getCustomerById = (id, callback) => {
    const sql = "SELECT * FROM customers WHERE customer_id = ?";
    db.query(sql, [id], callback);
};

// Add customer
const addCustomer = (customer, callback) => {
    const sql = `
        INSERT INTO customers
        (customer_name, phone, address)
        VALUES (?, ?, ?)
    `;

    db.query(sql,
        [
            customer.customer_name,
            customer.phone,
            customer.address
        ],
        callback
    );
};

const registerCustomer = (customer, callback) => {

    // Insert Customer
    const customerSql = `
        INSERT INTO customers
        (
            customer_name,
            phone,
            address
        )
        VALUES (?,?,?)
    `;

    db.query(

        customerSql,

        [
            customer.customer_name,
            customer.phone,
            customer.address
        ],

        (err, customerResult) => {

            if (err)
                return callback(err);

            const customerId = customerResult.insertId;

            // No vehicles provided
            if (!customer.vehicles || customer.vehicles.length === 0) {

                return callback(null, {
                    customer_id: customerId
                });

            }

            let insertedVehicles = 0;

            const vehicleSql = `
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
                VALUES (?,?,?,?,?,?,?)
            `;

            customer.vehicles.forEach(vehicle => {

                db.query(

                    vehicleSql,

                    [

                        customerId,

                        vehicle.vehicle_number,

                        vehicle.vehicle_type,

                        vehicle.fuel_type,

                        vehicle.brand,

                        vehicle.model,

                        vehicle.manufacture_year

                    ],

                    (err) => {

                        if (err)
                            return callback(err);

                        insertedVehicles++;

                        if (insertedVehicles === customer.vehicles.length) {

                            callback(null, {

                                customer_id: customerId

                            });

                        }

                    }

                );

            });

        }

    );

};
// Update customer
const updateCustomer = (id, customer, callback) => {

    const sql = `
        UPDATE customers
        SET customer_name=?,
            phone=?,
            address=?
        WHERE customer_id=?
    `;

    db.query(sql,
        [
            customer.customer_name,
            customer.phone,
            customer.address,
            id
        ],
        callback
    );
};

const searchCustomers = (keyword, callback) => {

    const search = "%" + keyword + "%";

    const sql = `
    SELECT *
    FROM customers
    WHERE
        customer_name LIKE ?
        OR phone LIKE ?
        OR address LIKE ?
    ORDER BY customer_name
    `;

    db.query(
        sql,
        [search, search, search],
        callback
    );

};

// Delete customer
const deleteCustomer = (id, callback) => {

    const sql =
        "DELETE FROM customers WHERE customer_id=?";

    db.query(sql, [id], callback);
};

module.exports = {

    getAllCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    registerCustomer,
    searchCustomers

};