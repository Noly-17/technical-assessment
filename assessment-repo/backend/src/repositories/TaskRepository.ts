import { db } from '../db/connection';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/Task';

export class TaskRepository {
  private static TABLE_NAME = 'tasks';

  async findById(id: string): Promise<Task | null> {
    const task = await db(TaskRepository.TABLE_NAME).where({ id }).first();
    return task || null;
  }

  async create(
    taskData: CreateTaskDTO & { creator_id: string }
  ): Promise<Task> {
    const [task] = await db(TaskRepository.TABLE_NAME)
      .insert(taskData)
      .returning('*');
    return task;
  }

  async update(id: string, taskData: UpdateTaskDTO): Promise<Task | null> {
    const [task] = await db(TaskRepository.TABLE_NAME)
      .where({ id })
      .update(taskData)
      .returning('*');
    return task || null;
  }

  async delete(id: string): Promise<boolean> {
    const count = await db(TaskRepository.TABLE_NAME).where({ id }).delete();
    return count > 0;
  }

  async list(filters?: {
    creator_id?: string;
    assignee_id?: string;
    status?: string;
  }): Promise<Task[]> {
    const query = db(TaskRepository.TABLE_NAME);

    if (filters) {
      if (filters.creator_id) query.where('creator_id', filters.creator_id);
      if (filters.assignee_id) query.where('assignee_id', filters.assignee_id);
      if (filters.status) query.where('status', filters.status);
    }

    return query.select('*');
  }

  async assignTask(
    taskId: string,
    assigneeId: string | null
  ): Promise<Task | null> {
    const [task] = await db(TaskRepository.TABLE_NAME)
      .where({ id: taskId })
      .update({ assignee_id: assigneeId })
      .returning('*');
    return task || null;
  }
}
