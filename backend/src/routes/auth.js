import express from "express";
import { participantSignup, participantLogin, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", participantSignup);
router.post("/login", participantLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;