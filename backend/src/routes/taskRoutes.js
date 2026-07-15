import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    getAllTasksController,
    getTaskByIdController,
    createTaskController,
    updateTaskController,
    deleteTaskController
} from "../controllers/taskController.js";

const router = express.Router();

// GET semua task + search + pagination
router.get("/", authMiddleware, getAllTasksController);

// GET task berdasarkan id
router.get("/:id", authMiddleware, getTaskByIdController);

// POST task
router.post("/", authMiddleware, createTaskController);

// UPDATE task
router.put("/:id", authMiddleware, updateTaskController);

// DELETE task
router.delete("/:id", authMiddleware, deleteTaskController);

export default router;