require("dotenv").config();
const db = require("./config/db");

(async () => {
    try {
        const result = await db.pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'job_parts'
            ORDER BY ordinal_position
        `);
        console.table(result.rows);
    } catch (err) {
        console.error("Error:", err);
        process.exitCode = 1;
    } finally {
        await db.pool.end();
    }
})();
