const db = require('./config/db');
require('dotenv').config();

db.query("DESCRIBE job_parts", (err, result) => {
    if (err) console.error("Error:", err);
    else console.log("Schema:", result);
    process.exit();
});
