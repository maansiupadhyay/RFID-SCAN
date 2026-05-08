import { Router } from 'express';
import authRoutes from './auth.routes';
import toolRoutes from './tool.routes';
import transactionRoutes from './transaction.routes';
import scanRoutes from './scan.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tools', toolRoutes);
router.use('/transactions', transactionRoutes);
router.use('/scans', scanRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
