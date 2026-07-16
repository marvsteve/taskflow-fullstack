import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  console.log("Menyambungkan ke database...");
  const pool = mysql.createPool(process.env.DATABASE_URL);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Tabel 'users' berhasil dibuat (atau memang sudah ada sebelumnya).");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Gagal membuat tabel:", err.message);
  process.exit(1);
});
