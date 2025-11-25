// src/routes/protocols.js
import express from 'express';
import { saveProtocol, getProtocolById, getProtocolsByProjectId } from '../controllers/protocolController.js';

const router = express.Router();

// Save new protocol
router.post('/save', saveProtocol);

// View protocol (GET /api/protocols/:id)
router.get('/:id', getProtocolById);

// Handles /api/protocols?project_id=1
router.get('/', getProtocolsByProjectId); 

export default router;
