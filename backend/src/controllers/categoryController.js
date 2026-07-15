import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoryService.js";

/**
 * GET Semua Category
 */
export const getCategories = async (req, res) => {

    try {

        const categories = await getAllCategories();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * GET Category By ID
 */
export const getCategory = async (req, res) => {

    try {

        const category = await getCategoryById(req.params.id);

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category tidak ditemukan"
            });

        }

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * CREATE Category
 */
export const createNewCategory = async (req, res) => {

    try {

        const result = await createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category berhasil ditambahkan",
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * UPDATE Category
 */
export const updateCategoryById = async (req, res) => {

    try {

        const result = await updateCategory(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Category berhasil diupdate",
            affectedRows: result.affectedRows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * DELETE Category
 */
export const deleteCategoryById = async (req, res) => {

    try {

        const result = await deleteCategory(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category berhasil dihapus",
            affectedRows: result.affectedRows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};