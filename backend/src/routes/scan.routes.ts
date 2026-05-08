import { Router } from 'express';
import scanController from '../controllers/scan.controller';
import { authMiddleware, validate } from '../middleware';
import { scanSchema } from '../validators/scan.validator';

const router = Router();

router.use(authMiddleware);

router.post('/scan', validate(scanSchema), scanController.performScan);
router.get('/history', scanController.getScanHistory);

export default router;
