import express from 'express';
import { saveProtocol } from '../controllers/protocolController.js';

const router = express.Router();
router.post('/save', saveProtocol);

export default router;
