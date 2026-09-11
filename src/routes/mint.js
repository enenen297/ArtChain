import express from 'express';
import mintController from '../controllers/mintController.js';

const router = express.Router();

// API Route: POST /mint/confirm
router.post('/confirm', mintController.confirmMint);

export default router;