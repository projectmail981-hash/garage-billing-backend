require("dotenv").config();
const db = require("./config/db");

const addJobServicesColumn = `ALTER TABLE job_services ADD COLUMN is_completed BOOLEAN DEFAULT FALSE;`;
const addJobPartsColumn = `ALTER TABLE job_parts ADD COLUMN is_completed BOOLEAN DEFAULT FALSE;`;

db.query(addJobServicesColumn, (err) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("is_completed already exists on job_services");
        } else {
            console.error("Error adding to job_services:", err);
        }
    } else {
        console.log("Added is_completed to job_services");
    }

    db.query(addJobPartsColumn, (err) => {
        if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("is_completed already exists on job_parts");
            } else {
                console.error("Error adding to job_parts:", err);
            }
        } else {
            console.log("Added is_completed to job_parts");
        }
        process.exit();
    });
});
