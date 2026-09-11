import express from 'express';
import verifyController from '../controllers/verifyController.js';

const router = express.Router();

// View Route: [GET] /verify
router.get('/', verifyController.index);

// API Route: [POST] /verify/api (Xử lý tra cứu qua CertID)
router.post('/api', verifyController.processVerifyApi);

export default router;