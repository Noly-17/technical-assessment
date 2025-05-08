import { db } from '../db/connection';

async function migrate() {
  try {
    await db.migrate.latest();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

migrate();
