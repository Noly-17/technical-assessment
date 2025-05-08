import { db } from '../db/connection';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/User';

export class UserRepository {
  private static TABLE_NAME = 'users';

  async findById(id: string): Promise<User | null> {
    const user = await db(UserRepository.TABLE_NAME).where({ id }).first();
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db(UserRepository.TABLE_NAME).where({ email }).first();
    return user || null;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    try {
      console.log(
        'Attempting to create user with data:',
        JSON.stringify(userData, null, 2)
      );
      console.log('Using table:', UserRepository.TABLE_NAME);

      const [user] = await db(UserRepository.TABLE_NAME)
        .insert(userData)
        .returning('*');

      return user;
    } catch (error) {
      console.error('Error in UserRepository.create:', error);
      throw error;
    }
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User | null> {
    const [user] = await db(UserRepository.TABLE_NAME)
      .where({ id })
      .update(userData)
      .returning('*');
    return user || null;
  }

  async delete(id: string): Promise<boolean> {
    const count = await db(UserRepository.TABLE_NAME).where({ id }).delete();
    return count > 0;
  }

  async list(): Promise<User[]> {
    return db(UserRepository.TABLE_NAME).select('*');
  }
}
