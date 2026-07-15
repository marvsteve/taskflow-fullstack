import pool from "../config/database.js";

/**
 * ==========================================
 * GET Semua Category
 * ==========================================
 */
export const getAllCategories = async () => {

    const [rows] = await pool.query(`
        SELECT *
        FROM categories
        ORDER BY id ASC
    `);

    return rows;
};

/**
 * ==========================================
 * GET Category Berdasarkan ID
 * ==========================================
 */
export const getCategoryById = async (id) => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM categories
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

/**
 * ==========================================
 * CREATE Category
 * ==========================================
 */
export const createCategory = async (category) => {

    const { name, color } = category;

    const [result] = await pool.query(
        `
        INSERT INTO categories
        (
            name,
            color
        )
        VALUES
        (?, ?)
        `,
        [
            name,
            color
        ]
    );

    return result;
};

/**
 * ==========================================
 * UPDATE Category
 * ==========================================
 */
export const updateCategory = async (id, category) => {

    const { name, color } = category;

    const [result] = await pool.query(
        `
        UPDATE categories
        SET
            name = ?,
            color = ?
        WHERE id = ?
        `,
        [
            name,
            color,
            id
        ]
    );

    return result;
};

/**
 * ==========================================
 * DELETE Category
 * ==========================================
 */
export const deleteCategory = async (id) => {

    const [result] = await pool.query(
        `
        DELETE FROM categories
        WHERE id = ?
        `,
        [id]
    );

    return result;
};