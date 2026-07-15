import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import pool from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Memastikan variabel lingkungan dimuat paling awal
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Middleware Configuration
|--------------------------------------------------------------------------
*/

// Mengizinkan domain lokal saat development dan domain Vercel saat production
const allowedOrigins = [
  "http://localhost:5173", 
  process.env.FRONTEND_URL // URL Vercel kamu akan dimasukkan ke variabel ini nanti
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Mengizinkan request tanpa origin (seperti mobile apps atau curl/postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      } else {
        return callback(new Error('Akses diblokir oleh kebijakan CORS Backend TaskFlow'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 TaskFlow API berjalan sukses di server publik",
  });
});

/*
|--------------------------------------------------------------------------
| Database Connection Check
|--------------------------------------------------------------------------
*/

try {
  const connection = await pool.getConnection();
  console.log("✅ Database MySQL berhasil terhubung dengan aman!");
  connection.release();
} catch (err) {
  console.error("❌ Database gagal terhubung. Periksa konfigurasi URL Database Anda.");
  console.error(err.message);
}

/*
|--------------------------------------------------------------------------
| Start Express Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan dengan aman pada port: ${PORT}`);
});
module.exports = app;