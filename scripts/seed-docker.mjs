#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Sample user ID - replace with your actual Clerk user ID when you sign up
const SEED_USER_ID = "user_sample_123";

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await sql`DELETE FROM transactions`;
    await sql`DELETE FROM accounts`;
    await sql`DELETE FROM categories`;
    
    // Insert categories
    console.log('📂 Inserting categories...');
    await sql`
      INSERT INTO categories (id, name, user_id, plaid_id) VALUES 
      ('category_1', 'Food', ${SEED_USER_ID}, null),
      ('category_2', 'Rent', ${SEED_USER_ID}, null),
      ('category_3', 'Utilities', ${SEED_USER_ID}, null),
      ('category_4', 'Transportation', ${SEED_USER_ID}, null),
      ('category_5', 'Entertainment', ${SEED_USER_ID}, null)
    `;
    
    // Insert accounts
    console.log('🏦 Inserting accounts...');
    await sql`
      INSERT INTO accounts (id, name, user_id, plaid_id) VALUES 
      ('account_1', 'Checking Account', ${SEED_USER_ID}, null),
      ('account_2', 'Savings Account', ${SEED_USER_ID}, null)
    `;
    
    // Insert transactions
    console.log('💳 Inserting transactions...');
    await sql`
      INSERT INTO transactions (id, account_id, category_id, date, amount, payee, notes) VALUES 
      ('transaction_1', 'account_1', 'category_1', '2024-08-01', -2500, 'Restaurant ABC', 'Lunch'),
      ('transaction_2', 'account_1', 'category_2', '2024-08-01', -120000, 'Property Management', 'Monthly rent'),
      ('transaction_3', 'account_2', null, '2024-08-02', 500000, 'Salary Deposit', 'Monthly salary'),
      ('transaction_4', 'account_1', 'category_3', '2024-08-03', -8500, 'Electric Company', 'Monthly electricity bill')
    `;
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 5 categories created');
    console.log('   - 2 accounts created');
    console.log('   - 4 transactions created');
    console.log('');
    console.log('🔑 Note: Data is created for user ID:', SEED_USER_ID);
    console.log('   You may need to sign up with Clerk and update the user ID to see the data in the app.');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
