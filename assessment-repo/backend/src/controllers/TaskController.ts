import { Response } from 'express';
import { TaskRepository } from '../repositories/TaskRepository';
import { AuthRequest } from '../middleware/auth';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/Task';

export class TaskController {
  private taskRepo: TaskRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
  }

  createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const taskData: CreateTaskDTO = req.body;
      const task = await this.taskRepo.create({
        ...taskData,
        creator_id: req.user!.id,
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task' });
    }
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const taskData: UpdateTaskDTO = req.body;

      const existingTask = await this.taskRepo.findById(id);
      if (!existingTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (existingTask.creator_id !== req.user!.id) {
        res.status(403).json({ message: 'Not authorized to update this task' });
        return;
      }

      const task = await this.taskRepo.update(id, taskData);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task' });
    }
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingTask = await this.taskRepo.findById(id);
      if (!existingTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (existingTask.creator_id !== req.user!.id) {
        res.status(403).json({ message: 'Not authorized to delete this task' });
        return;
      }

      await this.taskRepo.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  };

  getTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskRepo.findById(id);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task' });
    }
  };

  listTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, assignee } = req.query;
      const filters: any = {};

      if (status) filters.status = status;
      if (assignee === 'me') {
        filters.assignee_id = req.user!.id;
      } else if (assignee === 'created') {
        filters.creator_id = req.user!.id;
      }

      const tasks = await this.taskRepo.list(filters);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  };

  assignTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { assignee_id } = req.body;

      const existingTask = await this.taskRepo.findById(id);
      if (!existingTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (existingTask.creator_id !== req.user!.id) {
        res.status(403).json({ message: 'Not authorized to assign this task' });
        return;
      }

      const task = await this.taskRepo.assignTask(id, assignee_id);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning task' });
    }
  };
}
