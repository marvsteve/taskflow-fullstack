import { getDashboard } from "../services/dashboardService.js";

export const dashboard = async (req, res) => {

    try {

        const data = await getDashboard(req.user.id);

        res.status(200).json({

            success: true,

            message: "Dashboard berhasil diambil",

            data

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};