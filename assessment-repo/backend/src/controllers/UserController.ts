import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

const users = new Map();

export class UserController {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Register request received with body:', req.body);
      const { email, password, name } = req.body;

      // Check if email exists in memory store
      if (Array.from(users.values()).some((user) => user.email === email)) {
        res.status(400).json({ message: 'Email already registered' });
        return;
      }

      // Create in-memory user directly instead of trying database first
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = generateId();
      const now = new Date();

      // Create user in memory
      const user = {
        id,
        email,
        password: hashedPassword,
        name,
        created_at: now,
        updated_at: now,
      };

      users.set(id, user);
      console.log('Created user in memory:', { id, email, name });

      const token = jwt.sign({ id, email }, JWT_SECRET, {
        expiresIn: '24h',
      });

      res.status(201).json({
        user: {
          id,
          email,
          name,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        message: 'Error creating user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Login request received with body:', req.body);
      const { email, password } = req.body;

      // First check in-memory store
      const memoryUser = Array.from(users.values()).find(
        (user) => user.email === email
      );
      console.log(
        'In-memory users:',
        Array.from(users.values()).map((u) => ({ id: u.id, email: u.email }))
      );
      console.log(
        'Found memory user:',
        memoryUser ? { id: memoryUser.id, email: memoryUser.email } : null
      );

      if (memoryUser) {
        const isValidPassword = await bcrypt.compare(
          password,
          memoryUser.password
        );
        console.log('Password validation result:', isValidPassword);

        if (isValidPassword) {
          const token = jwt.sign(
            { id: memoryUser.id, email: memoryUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.json({
            user: {
              id: memoryUser.id,
              email: memoryUser.email,
              name: memoryUser.name,
            },
            token,
          });
          return;
        }
      }

      try {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
          res.status(401).json({ message: 'Invalid credentials' });
          return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          res.status(401).json({ message: 'Invalid credentials' });
          return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: '24h',
        });

        res.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        });
      } catch (dbError) {
        console.error('Database error during login:', dbError);
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error during login' });
    }
  };

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user && users.has(req.user.id)) {
        const user = users.get(req.user.id);
        res.json({
          id: user.id,
          email: user.email,
          name: user.name,
        });
        return;
      }

      try {
        const user = await this.userRepo.findById(req.user!.id);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        res.json({
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } catch (dbError) {
        console.error('Database error during profile fetch:', dbError);
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (req.user && users.has(req.user.id)) {
        const user = users.get(req.user.id);
        const updateData = { ...user };

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) {
          updateData.password = await bcrypt.hash(password, 10);
        }

        updateData.updated_at = new Date();
        users.set(req.user.id, updateData);

        res.json({
          id: updateData.id,
          email: updateData.email,
          name: updateData.name,
        });
        return;
      }

      try {
        const updateData: any = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) {
          updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await this.userRepo.update(req.user!.id, updateData);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        res.json({
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } catch (dbError) {
        console.error('Database error during profile update:', dbError);
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  };
}
