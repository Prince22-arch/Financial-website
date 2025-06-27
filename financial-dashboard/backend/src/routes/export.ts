import express from 'express';
import { ExportController } from '../controllers/exportController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, ExportController.exportTransactions);

export default router;
