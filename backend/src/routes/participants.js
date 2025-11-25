/* backend/src/routes/participants.js */
import express from "express";
import { getParticipants, createParticipant } from "../controllers/participantController.js";

const router = express.Router();

router.get("/", getParticipants);
router.post("/create", createParticipant);

export default router;