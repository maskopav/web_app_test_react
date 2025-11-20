// src/routes/participantProtocols.js
import express from "express";
import { 
  createParticipantProtocol, 
  resolveParticipantToken,
  getParticipantProtocolView,
  getParticipantProtocolViewById,
  activateParticipantProtocol,
  deactivateParticipantProtocol
} from "../controllers/participantProtocolController.js";

const router = express.Router();

// POST /api/participant-protocols/create
router.post("/create", createParticipantProtocol);

// Assign (activate)
router.post("/activate", activateParticipantProtocol);

// End assignment (deactivate)
router.post("/deactivate", deactivateParticipantProtocol);

// GET /api/participant-protocol/:token
/// e.g. http://localhost:3000/participant-protocol/99b8883a-c142-11f0-9f82-1063c8a646e0
/// Resolve unique token and load participant, project_protocol, protocol (full, including tasks)
router.get("/:token", resolveParticipantToken);

// GET /api/participant-protocol?project_id=1,participant_id=1
/// e.g. http://localhost:3000/participant-protocol?project_id=1
router.get("/", getParticipantProtocolView);

// GET /api/participant-protocol/:id
/// get single row from v_participant_protocols by participant_protocol_id
router.get("/:id", getParticipantProtocolViewById);
  
export default router;
