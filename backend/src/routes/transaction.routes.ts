import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import { authMiddleware, validate } from '../middleware';
import { issueToolSchema, returnToolSchema } from '../validators/transaction.validator';

const router = Router();

router.use(authMiddleware);

router.post('/issue', validate(issueToolSchema), transactionController.issueTool);
router.post('/return', validate(returnToolSchema), transactionController.returnTool);
router.get('/history', transactionController.getTransactionHistory);

export default router;
