const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'tokaido.proxy.rlwy.net',
    port: 35535,
    user: 'root',
    password: 'pIvIqpCANggtmUcWKovgfhJXxtetcYFG',
    database: 'railway'
});

connection.connect();

connection.query("SELECT * FROM customers ORDER BY customer_id DESC", (err, results) => {
    if (err) {
        console.error("Customers Error:", err);
    } else {
        console.log("Success:", results.length, "customers");
    }
    connection.end();
});
