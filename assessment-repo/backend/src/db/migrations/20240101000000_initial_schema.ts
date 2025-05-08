import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable UUID extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });

  // Create tasks table
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.text('description');
    table
      .uuid('assignee_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .uuid('creator_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable();
    table
      .enum('status', ['TODO', 'IN_PROGRESS', 'COMPLETED'])
      .defaultTo('TODO');
    table.enum('priority', ['LOW', 'MEDIUM', 'HIGH']).defaultTo('MEDIUM');
    table.timestamp('due_date');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
  await knex.schema.dropTable('users');
}
