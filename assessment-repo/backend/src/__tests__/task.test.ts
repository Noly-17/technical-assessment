// Set NODE_ENV to test before importing anything
process.env.NODE_ENV = 'test';

import request from 'supertest';
import { app } from '../index';
import { Task } from '../models/Task';
import { Request, Response, NextFunction } from 'express';

// Mock the database connection
jest.mock('../db/connection', () => {
  return {
    db: {
      destroy: jest.fn().mockResolvedValue(true),
    },
  };
});

// Mock the TaskRepository
jest.mock('../repositories/TaskRepository', () => {
  const mockTasks: Task[] = [];
  let taskIdCounter = 1;

  return {
    TaskRepository: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockImplementation((taskData: any) => {
          const newTask: Task = {
            id: String(taskIdCounter++),
            ...taskData,
            status: taskData.status || 'TODO',
            priority: taskData.priority || 'MEDIUM',
            created_at: new Date(),
            updated_at: new Date(),
          };
          mockTasks.push(newTask);
          return Promise.resolve(newTask);
        }),
        list: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockTasks);
        }),
        findById: jest.fn().mockImplementation((id: string) => {
          const task = mockTasks.find((t) => t.id === id);
          return Promise.resolve(task || null);
        }),
        update: jest.fn().mockImplementation((id: string, taskData: any) => {
          const index = mockTasks.findIndex((t) => t.id === id);
          if (index === -1) return Promise.resolve(null);

          mockTasks[index] = {
            ...mockTasks[index],
            ...taskData,
            updated_at: new Date(),
          };
          return Promise.resolve(mockTasks[index]);
        }),
        delete: jest.fn().mockImplementation((id: string) => {
          const index = mockTasks.findIndex((t) => t.id === id);
          if (index === -1) return Promise.resolve(false);

          mockTasks.splice(index, 1);
          return Promise.resolve(true);
        }),
      };
    }),
  };
});

// Mock the UserRepository for authentication
jest.mock('../repositories/UserRepository', () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockImplementation((userData: any) => {
          return Promise.resolve({
            id: 'test-user-id',
            ...userData,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }),
        findByEmail: jest.fn().mockResolvedValue({
          id: 'test-user-id',
          email: 'test@example.com',
          password:
            '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
          name: 'Test User',
        }),
      };
    }),
  };
});

// Mock the auth middleware
jest.mock('../middleware/auth', () => {
  return {
    authenticate: (req: Request, res: Response, next: NextFunction) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    },
    generateToken: jest.fn().mockReturnValue('mocked-jwt-token'),
  };
});

describe('Task API', () => {
  let taskId: string;

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      taskId = response.body.id;
    });
  });

  describe('GET /api/tasks', () => {
    it('should list all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a specific task', async () => {
      const response = await request(app).get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const response = await request(app).put(`/api/tasks/${taskId}`).send({
        title: 'Updated Task',
        status: 'IN_PROGRESS',
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.status).toBe('IN_PROGRESS');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const response = await request(app).delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(204);
    });
  });
});
