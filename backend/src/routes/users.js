// src/routes/users.js
import express from "express";
import { getAllUsers,
    toggleUserStatus
 } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/toggle-status", toggleUserStatus);

export default router;