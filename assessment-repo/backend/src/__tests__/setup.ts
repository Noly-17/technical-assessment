import { db } from '../db/connection';

beforeAll(async () => {
  // Run migrations
  await db.migrate.latest();
});

afterAll(async () => {
  // Clean up database
  await db.migrate.rollback();
  await db.destroy();
});
