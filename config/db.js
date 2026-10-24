const { Pool } = require("pg");

// Supabase PostgreSQL connection.
// Set DATABASE_URL in Render/Supabase (and locally in .env).
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("DATABASE_URL is not set. Database connection will fail until it is configured.");
}

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: false },
    max: Number(process.env.DB_POOL_MAX || 5),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

// Keep the existing mysql2-style callback API used by the application while
// moving the database engine from MySQL to PostgreSQL.
const primaryKeys = {
    customers: "customer_id",
    vehicles: "vehicle_id",
    services: "service_id",
    inventory: "part_id",
    job_cards: "job_id",
    job_services: "job_service_id",
    job_parts: "job_part_id",
    invoices: "invoice_id"
};

function convertPlaceholders(sql) {
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
}

function prepareSql(sql) {
    let prepared = sql
        .replace(/\bIFNULL\s*\(/gi, "COALESCE(")
        .replace(/\bCURDATE\s*\(\s*\)/gi, "CURRENT_DATE");

    const insertMatch = prepared.match(/INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    if (insertMatch && !/\bRETURNING\b/i.test(prepared)) {
        const table = insertMatch[1];
        const pk = primaryKeys[table];
        if (pk) prepared = `${prepared.trim().replace(/;\s*$/, "")} RETURNING ${pk}`;
    }

    return convertPlaceholders(prepared);
}

function normalizeCallbackResult(result, sql) {
    if (/^\s*SELECT\b/i.test(sql) || /\bRETURNING\b/i.test(sql)) {
        return result.rows;
    }

    const insertMatch = sql.match(/INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    const insertId = insertMatch && result.rows[0]
        ? result.rows[0][primaryKeys[insertMatch[1]]]
        : undefined;

    return {
        insertId,
        affectedRows: result.rowCount,
        rowCount: result.rowCount,
        rows: result.rows
    };
}

function query(sql, values, callback) {
    if (typeof values === "function") {
        callback = values;
        values = [];
    }

    const preparedSql = prepareSql(sql);

    pool.query(preparedSql, values || [])
        .then(result => callback(null, normalizeCallbackResult(result, sql)))
        .catch(error => callback(error));
}

function promiseQuery(sql, values) {
    const preparedSql = prepareSql(sql);
    return pool.query(preparedSql, values || [])
        .then(result => [result.rows, result.fields]);
}

const db = {
    query,
    promise: () => ({ query: promiseQuery }),
    pool
};

pool.query("SELECT 1")
    .then(() => console.log("PostgreSQL connected via Supabase pool"))
    .catch(err => console.error("Database Connection Failed:", err.message));

module.exports = db;
