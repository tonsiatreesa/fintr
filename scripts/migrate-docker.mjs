#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    console.log('🗄️  Starting database migrations...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log('📦 Connected to Neon database');
    
    // Check if migrations directory exists
    const migrationsPath = path.join(process.cwd(), 'drizzle');
    if (!fs.existsSync(migrationsPath)) {
      console.log('⚠️  No migrations directory found at:', migrationsPath);
      console.log('📁 Available directories:', fs.readdirSync(process.cwd()));
      return;
    }

    console.log('� Found migration files:', fs.readdirSync(migrationsPath));
    console.log('�🔄 Running migrations...');
    
    await migrate(db, { migrationsFolder: migrationsPath });
    
    console.log('✅ Migrations completed successfully!');
    console.log('🎉 Your Neon database schema is now up to date!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
