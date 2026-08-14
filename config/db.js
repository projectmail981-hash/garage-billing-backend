const mysql=require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if(err) {
        console.log("Database Connection Failed:", err);
    } else {
        console.log("MySQL Connected via Pool");
        connection.release();
    }
});

module.exports = pool;