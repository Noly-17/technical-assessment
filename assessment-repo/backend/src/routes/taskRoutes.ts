import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticate } from '../middleware/auth';
import { validateTask } from '../middleware/validation';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.post('/', validateTask, taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/assign', taskController.assignTask);

export default router;
