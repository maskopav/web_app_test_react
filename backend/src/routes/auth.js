import express from "express";
import { participantSignup, 
    participantLogin, 
    forgotPassword, 
    resetPassword,
    adminLogin,
    adminForgotPassword,
    adminResetPassword,
    setupAdminProfile,
    getAllUsers,
    getUserProjectAssignments, 
    toggleUserStatus,
    getAllProjects,
    assignUserToProject
 } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", participantSignup);
router.post("/login", participantLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/admin/login", adminLogin);
router.post("/admin/forgot-password", adminForgotPassword);
router.post("/admin/reset-password", adminResetPassword);
router.post("/setup-profile", setupAdminProfile);
router.get("/users", getAllUsers);
router.get("/user-projects", getUserProjectAssignments);
router.post("/users/toggle-status", toggleUserStatus);
router.get("/projects-list", getAllProjects); 
router.post("/assign-project", assignUserToProject); 

export default router;