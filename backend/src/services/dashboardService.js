import pool from "../config/database.js";

export const getDashboard = async (userId) => {

    const [[totalTask]] = await pool.query(
        `
        SELECT COUNT(*) AS totalTask
        FROM tasks
        WHERE user_id = ?
        `,
        [userId]
    );

    const [[todo]] = await pool.query(
        `
        SELECT COUNT(*) AS todo
        FROM tasks
        WHERE status = 'todo'
        AND user_id = ?
        `,
        [userId]
    );

    const [[inProgress]] = await pool.query(
        `
        SELECT COUNT(*) AS inProgress
        FROM tasks
        WHERE status = 'in_progress'
        AND user_id = ?
        `,
        [userId]
    );

    const [[done]] = await pool.query(
        `
        SELECT COUNT(*) AS done
        FROM tasks
        WHERE status = 'done'
        AND user_id = ?
        `,
        [userId]
    );

    return {

        totalTask: totalTask.totalTask,

        todo: todo.todo,

        inProgress: inProgress.inProgress,

        done: done.done

    };

};