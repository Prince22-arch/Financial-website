import express from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, TransactionController.getTransactions);
router.get('/dashboard/stats', authenticateToken, TransactionController.getDashboardStats);

export default router;
