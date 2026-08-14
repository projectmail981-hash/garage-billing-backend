require('dotenv').config();
const db = require('./config/db');

const sql = `ALTER TABLE inventory ADD COLUMN mrp DECIMAL(10,2) DEFAULT 0, ADD COLUMN selling_price DECIMAL(10,2) DEFAULT 0`;
db.query(sql, (err, result) => {
    if (err) console.error("Error:", err);
    else console.log("Table altered successfully!");
    process.exit();
});
