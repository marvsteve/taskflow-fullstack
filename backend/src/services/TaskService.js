import pool from "../config/database.js";

/**
 * ==========================================
 * GET Semua Task + Search + Pagination
 * ==========================================
 */
export const getAllTasks = async (search = "", page = 1, limit = 5) => {

    const offset = (page - 1) * limit;

    let where = "";
    const params = [];

    if (search) {
        where = `
            WHERE
                t.title LIKE ?
                OR t.description LIKE ?
        `;

        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    // Hitung total data
    const [countRows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM tasks t
        ${where}
        `,
        params
    );

    const totalData = countRows[0].total;

    // Ambil data sesuai pagination
    const [rows] = await pool.query(
        `
        SELECT
            t.id,
            t.title,
            t.description,
            t.status,
            t.user_id,
            u.name AS user_name,
            c.name AS category_name
        FROM tasks t
        LEFT JOIN users u
            ON t.user_id = u.id
        LEFT JOIN categories c
            ON t.category_id = c.id

        ${where}

        ORDER BY t.id DESC

        LIMIT ?
        OFFSET ?
        `,
        [
            ...params,
            Number(limit),
            Number(offset)
        ]
    );

    return {
        data: rows,
        totalData,
        totalPage: Math.ceil(totalData / limit),
        currentPage: Number(page),
        limit: Number(limit)
    };

};

/**
 * ==========================================
 * GET Task Berdasarkan ID
 * ==========================================
 */
export const getTaskById = async (id, userId) => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM tasks
        WHERE id = ?
        AND user_id = ?
        `,
        [id, userId]
    );

    return rows[0];

};

/**
 * ==========================================
 * CREATE Task
 * ==========================================
 */
export const createTask = async (task) => {

    const {
        title,
        description,
        status,
        user_id,
        category_id
    } = task;

    const [result] = await pool.query(
        `
        INSERT INTO tasks
        (
            title,
            description,
            status,
            user_id,
            category_id
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
            title,
            description,
            status,
            user_id,
            category_id
        ]
    );

    return result;

};

/**
 * ==========================================
 * UPDATE Task
 * ==========================================
 */
export const updateTask = async (id, userId, task) => {

    const {
        title,
        description,
        status,
        category_id
    } = task;

    const [result] = await pool.query(
        `
        UPDATE tasks
        SET
            title = ?,
            description = ?,
            status = ?,
            category_id = ?
        WHERE id = ?
        AND user_id = ?
        `,
        [
            title,
            description,
            status,
            category_id,
            id,
            userId
        ]
    );

    return result;

};

/**
 * ==========================================
 * DELETE Task
 * ==========================================
 */
export const deleteTask = async (id, userId) => {

    const [result] = await pool.query(
        `
        DELETE FROM tasks
        WHERE id = ?
        AND user_id = ?
        `,
        [
            id,
            userId
        ]
    );

    return result;

};