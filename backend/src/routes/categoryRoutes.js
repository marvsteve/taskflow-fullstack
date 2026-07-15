import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    getCategories,
    getCategory,
    createNewCategory,
    updateCategoryById,
    deleteCategoryById
} from "../controllers/categoryController.js";

const router = express.Router();

// GET semua category
router.get("/", authMiddleware, getCategories);

// GET category by id
router.get("/:id", authMiddleware, getCategory);

// POST category
router.post("/", authMiddleware, createNewCategory);

// PUT category
router.put("/:id", authMiddleware, updateCategoryById);

// DELETE category
router.delete("/:id", authMiddleware, deleteCategoryById);

export default router;