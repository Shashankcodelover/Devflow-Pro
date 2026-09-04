import { Router } from 'express'
import { jobController } from '../controllers/jobController'
import { protect } from '../middleware/authMiddleware'

const router = Router()
router.use(protect)

router.get('/',       jobController.getAll)
router.get('/stats',  jobController.getStats)
router.get('/:id',    jobController.getById)
router.post('/',      jobController.create)
router.patch('/:id',  jobController.update)
router.delete('/:id', jobController.delete)

export default router
