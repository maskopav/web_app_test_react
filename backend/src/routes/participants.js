/* backend/src/routes/participants.js */
import express from "express";
import { getParticipants, createParticipant, updateParticipant } from "../controllers/participantController.js";

const router = express.Router();

router.get("/", getParticipants);
router.post("/create", createParticipant);
router.put("/:id", updateParticipant);

export default router;