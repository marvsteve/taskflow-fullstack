const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let pool;

// Jika ada DATABASE_URL (untuk deploy online), gunakan itu. Jika tidak, gunakan settingan lokal.
if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'taskflow_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;