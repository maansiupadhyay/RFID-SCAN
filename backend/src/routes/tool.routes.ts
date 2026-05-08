import { Router } from 'express';
import toolController from '../controllers/tool.controller';
import { authMiddleware, roleMiddleware, validate } from '../middleware';
import { createToolSchema, updateToolSchema } from '../validators/tool.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', toolController.getAllTools);
router.get('/:id', toolController.getToolById);

// Admin only routes
router.post('/', roleMiddleware('ADMIN'), validate(createToolSchema), toolController.createTool);
router.put('/:id', roleMiddleware('ADMIN'), validate(updateToolSchema), toolController.updateTool);
router.delete('/:id', roleMiddleware('ADMIN'), toolController.deleteTool);

export default router;
