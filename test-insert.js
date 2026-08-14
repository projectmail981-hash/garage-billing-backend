const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'tokaido.proxy.rlwy.net',
    port: 35535,
    user: 'root',
    password: 'pIvIqpCANggtmUcWKovgfhJXxtetcYFG',
    database: 'railway'
});

connection.connect();

const sql = "ALTER TABLE job_parts ADD COLUMN part_id INT NULL";
const values = [];

connection.query(sql, values, (err, results) => {
    if (err) {
        console.error("DB Error:", err);
    } else {
        console.log("Success:", results);
    }
    connection.end();
});
