import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
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

export const login = async (req, res) => {

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