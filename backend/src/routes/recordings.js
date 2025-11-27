// src/routed/recordings.js
import express from "express";
import multer from "multer";
import { uploadRecording } from "../controllers/recordingController.js";

const router = express.Router();

// Store in memory initially, controller handles saving to disk
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/recordings/upload
router.post("/upload", upload.single("audio"), uploadRecording);

export default router;