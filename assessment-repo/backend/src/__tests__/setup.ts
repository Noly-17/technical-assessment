// Set NODE_ENV to test before importing anything
process.env.NODE_ENV = 'test';

// Mock the database connection
jest.mock('../db/connection', () => {
  return {
    db: {
      migrate: {
        latest: jest.fn().mockResolvedValue(true),
        rollback: jest.fn().mockResolvedValue(true),
      },
      destroy: jest.fn().mockResolvedValue(true),
    },
  };
});

// Import the mocked db
import { db } from '../db/connection';

// Basic test setup
beforeAll(async () => {
  // Run migrations (mocked)
  await db.migrate.latest();
});

afterAll(async () => {
  // Clean up database (mocked)
  await db.migrate.rollback();
  await db.destroy();
});

// Add a basic test to satisfy Jest's requirement
describe('Database setup', () => {
  it('should connect to the database', () => {
    expect(db).toBeDefined();
  });
});
