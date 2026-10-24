require("dotenv").config();
const db = require("./config/db");

const statements = [
    `ALTER TABLE job_services ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE job_parts ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE inventory ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2) DEFAULT 0`,
    `ALTER TABLE inventory ADD COLUMN IF NOT EXISTS selling_price NUMERIC(10,2) DEFAULT 0`,
    `ALTER TABLE inventory ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`
];

(async () => {
    try {
        for (const sql of statements) {
            await db.pool.query(sql);
            console.log(`OK: ${sql}`);
        }
        console.log("PostgreSQL migrations completed.");
    } catch (err) {
        console.error("Migration failed:", err);
        process.exitCode = 1;
    } finally {
        await db.pool.end();
    }
})();
