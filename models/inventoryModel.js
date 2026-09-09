const db = require("../config/db");

// Get all parts
const getAllInventory = (callback) => {
    db.query(
        "SELECT * FROM inventory ORDER BY part_id DESC",
        callback
    );
};

// Get part by ID
const getInventoryById = (id, callback) => {
    db.query(
        "SELECT * FROM inventory WHERE part_id=?",
        [id],
        callback
    );
};

const addInventory = (part, callback) => {

    const sql = `
    INSERT INTO inventory
    (
        part_name,
        category,
        stock_quantity,
        unit_price,
        mrp,
        selling_price,
        supplier,
        date
    )
    VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(sql, [
        part.part_name,
        part.category,
        part.stock_quantity,
        part.unit_price,
        part.mrp,
        part.selling_price,
        part.supplier,
        part.date
    ], callback);

};

const updateInventory = (id, part, callback) => {

    const sql = `
    UPDATE inventory
    SET
        part_name=?,
        category=?,
        stock_quantity=?,
        unit_price=?,
        mrp=?,
        selling_price=?,
        supplier=?,
        date=?
    WHERE part_id=?
    `;

    db.query(sql, [
        part.part_name,
        part.category,
        part.stock_quantity,
        part.unit_price,
        part.mrp,
        part.selling_price,
        part.supplier,
        part.date,
        id
    ], callback);

};

// Delete part
const deleteInventory = (id, callback) => {

    db.query(
        "DELETE FROM inventory WHERE part_id=?",
        [id],
        callback
    );

};

module.exports = {

    getAllInventory,
    getInventoryById,
    addInventory,
    updateInventory,
    deleteInventory

};