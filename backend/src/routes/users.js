// src/routes/users.js
import express from "express";
import { getAllUsers,
    toggleUserStatus,
    createAdmin
 } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/toggle-status", toggleUserStatus);
router.post("/create", createAdmin);

export default router;