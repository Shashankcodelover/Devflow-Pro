import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Upload can be called with or without auth in demo mode, but protects if token given
router.post('/upload', taskController.upload);

router.use(protect);
router.get('/', taskController.getAll);
router.get('/stats', taskController.getStats);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.delete);
router.delete('/', taskController.deleteAll);

export default router;