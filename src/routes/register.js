import express from 'express';
import multer from 'multer';

import registerController from '../controllers/registerController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// View Route
router.get('/', registerController.index);

// API Route
router.post('/api', upload.single('artwork'), registerController.processRegisterApi);


export default router;