export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  creator_id: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  assignee_id?: string;
  priority?: TaskPriority;
  due_date?: Date;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  assignee_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
}
