// src/routes/protocols.js
import express from 'express';
import { saveProtocol, getProtocolById } from '../controllers/protocolController.js';

const router = express.Router();

// Save new protocol
router.post('/save', saveProtocol);

// View protocol (GET /api/protocols/:id)
router.get('/:id', getProtocolById);

export default router;
