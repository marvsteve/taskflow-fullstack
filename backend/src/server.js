const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. KONFIGURASI CORS (MENGIZINKAN NETLIFY)
// ==========================================
app.use(cors({
  origin: '*', // Mengizinkan semua domain (termasuk Netlify kamu) untuk mengakses backend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==========================================
// 2. KONEKSI DATABASE (MYSQL AIVEN)
// ==========================================
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Cek Koneksi Database
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database MySQL berhasil terhubung dengan aman!");
    connection.release();
  } catch (err) {
    console.error("❌ Database gagal terhubung. Periksa konfigurasi URL Database Anda.");
    console.error(err.message);
  }
})();

// ==========================================
// 3. ROUTE UTAMA & TESTING
// ==========================================
// Ini ditambahkan agar Vercel tidak memunculkan error 404 saat halaman utama backend dibuka
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Server TaskFlow Backend berjalan dengan sukses secara online!",
    status: "Connected"
  });
});

// ==========================================
// 4. IMPORT & DAFTAR ROUTE APLIKASI
// ==========================================
const path = require('path');
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
app.use('/api/auth', authRoutes);


// ==========================================
// 5. MENJALANKAN SERVER
// ==========================================
// Tetap menggunakan app.listen untuk lokal, namun Vercel akan otomatis membypass ini
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan dengan aman pada port: ${PORT}`);
  });
}

// WAJIB ditaruh di paling bawah untuk kebutuhan deploy Vercel serverless
module.exports = app;
