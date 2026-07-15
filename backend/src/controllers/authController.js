// Gunakan require, bukan import!
const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "Register berhasil",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// Ekspor menggunakan CommonJS
module.exports = { register, login };