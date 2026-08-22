import { Router } from 'express'
import { taskController } from '../controllers/taskController'
import { protect, requireAdmin } from '../middleware/authMiddleware'

const router = Router()
router.use(protect)
router.get('/',     taskController.getAll)
router.get('/stats', taskController.getStats)
router.get('/:id',  taskController.getById)
router.post('/',    taskController.create)
router.patch('/:id', taskController.update)
router.delete('/:id', taskController.delete)

export default router