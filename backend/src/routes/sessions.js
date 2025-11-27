// src/routes/sessions.js
import express from "express";
import { initSession } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/init", initSession);

export default router;