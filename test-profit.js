const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'tokaido.proxy.rlwy.net',
    port: 35535,
    user: 'root',
    password: 'pIvIqpCANggtmUcWKovgfhJXxtetcYFG',
    database: 'railway'
});

const sql = `
SELECT 
    jp.job_part_id,
    jp.part_name,
    jp.quantity,
    jp.unit_price as jp_unit_price,
    jp.total_amount as jp_total_amount,
    i.part_id as i_part_id,
    i.unit_price as i_unit_price,
    i.selling_price as i_selling_price
FROM job_parts jp
LEFT JOIN inventory i ON jp.part_id = i.part_id;
`;

pool.query(sql, (err, results) => {
    if (err) console.error(err);
    else console.log("Results:", results);
    
    const profitSql = `
    SELECT IFNULL(SUM(jp.quantity * (jp.unit_price - IFNULL(i.unit_price, 0))), 0) as partsRevenue
    FROM job_parts jp
    LEFT JOIN inventory i ON jp.part_id = i.part_id;
    `;
    pool.query(profitSql, (err, res) => {
        if (err) console.error(err);
        else console.log("Calculated Parts Profit:", res);
        process.exit(0);
    });
});
