import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import bcrypt from "bcrypt";

export const registerUser = async (user) => {
    const { name, email, password } = user;

    const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (existingUser.length > 0) {
        throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword]
    );

    // Generate token langsung setelah register, supaya user otomatis "login"
    const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: { id: result.insertId, name, email }
    };
};

export const loginUser = async (email, password) => {
    const [users] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (users.length === 0) {
        throw new Error("Email tidak ditemukan");
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Password salah");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email }
    };
};