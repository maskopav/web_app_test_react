/* backend/src/routes/participants.js */
import express from "express";
import { 
    getParticipants, 
    createParticipant, 
    updateParticipant,
    searchParticipant
} from "../controllers/participantController.js";

const router = express.Router();

router.get("/", getParticipants);
router.get("/search", searchParticipant);
router.post("/create", createParticipant);
router.put("/:id", updateParticipant);

export default router;