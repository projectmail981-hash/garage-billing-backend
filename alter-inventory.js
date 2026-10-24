require("dotenv").config();
const db = require("./config/db");

(async () => {
    try {
        await db.pool.query(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2) DEFAULT 0`);
        await db.pool.query(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS selling_price NUMERIC(10,2) DEFAULT 0`);
        console.log("Inventory table updated successfully.");
    } catch (err) {
        console.error("Error:", err);
        process.exitCode = 1;
    } finally {
        await db.pool.end();
    }
})();
