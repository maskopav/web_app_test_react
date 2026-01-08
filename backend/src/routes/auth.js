import express from "express";
import { participantSignup, 
    participantLogin, 
    forgotPassword, 
    resetPassword,
    adminLogin,
    getAllUsers, 
    getUserProjectAssignments, 
    toggleUserStatus
 } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", participantSignup);
router.post("/login", participantLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/admin/login", adminLogin);
router.get("/users", getAllUsers);
router.get("/user-projects", getUserProjectAssignments);
router.post("/users/toggle-status", toggleUserStatus);

export default router;