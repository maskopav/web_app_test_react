import express from "express";
import { participantSignup, participantLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", participantSignup);
router.post("/login", participantLogin);

export default router;