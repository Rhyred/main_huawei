import mysql from 'mysql2/promise';

// Buat koneksi pool. Pool lebih efisien daripada koneksi tunggal
// karena mereka mengelola beberapa koneksi dan mendaur ulangnya.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'huapau_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
