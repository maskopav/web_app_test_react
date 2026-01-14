// backend/src/controllers/userController.js
import { executeQuery } from "../db/queryHelper.js";

// Fetch all users for the management table
export const getAllUsers = async (req, res) => {
    try {
        const rows = await executeQuery("SELECT * FROM view_users_management", []);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Simple toggle for user activation
export const toggleUserStatus = async (req, res) => {
    const { user_id, is_active } = req.body;
    try {
        await executeQuery("UPDATE users SET is_active = ? WHERE id = ?", [is_active, user_id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
};