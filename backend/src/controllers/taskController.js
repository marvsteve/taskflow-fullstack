import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from "../services/TaskService.js";

/**
 * ==========================================
 * GET Semua Task + Search + Pagination
 * ==========================================
 */
export const getAllTasksController = async (req, res) => {

    try {

        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const result = await getAllTasks(search, page, limit);

        res.status(200).json({
            success: true,
            message: "Data task berhasil diambil",
            page: result.currentPage,
            limit: result.limit,
            totalData: result.totalData,
            totalPage: result.totalPage,
            data: result.data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil data task"
        });

    }

};

/**
 * ==========================================
 * GET Task By ID
 * ==========================================
 */
export const getTaskByIdController = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const task = await getTaskById(id, userId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil task"
        });

    }

};

/**
 * ==========================================
 * CREATE Task
 * ==========================================
 */
export const createTaskController = async (req, res) => {

    try {

        const task = {
            ...req.body,
            user_id: req.user.id
        };

        const result = await createTask(task);

        res.status(201).json({
            success: true,
            message: "Task berhasil ditambahkan",
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal menambahkan task"
        });

    }

};

/**
 * ==========================================
 * UPDATE Task
 * ==========================================
 */
export const updateTaskController = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const result = await updateTask(id, userId, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task berhasil diupdate"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengupdate task"
        });

    }

};

/**
 * ==========================================
 * DELETE Task
 * ==========================================
 */
export const deleteTaskController = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const result = await deleteTask(id, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task berhasil dihapus"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal menghapus task"
        });

    }

};