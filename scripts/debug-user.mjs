#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function debugUserData() {
  const userId = 'user_3122nuhVzDsZCXTadYUSxw4Nkw2';
  
  try {
    console.log('🔍 Debugging user data for:', userId);
    console.log('');
    
    // Check accounts
    const accounts = await sql`SELECT * FROM accounts WHERE user_id = ${userId}`;
    console.log('📊 Accounts:');
    console.table(accounts);
    
    // Check categories  
    const categories = await sql`SELECT * FROM categories WHERE user_id = ${userId}`;
    console.log('📂 Categories:');
    console.table(categories);
    
    // Check transactions
    const transactions = await sql`SELECT * FROM transactions LIMIT 5`;
    console.log('💳 Transactions (first 5):');
    console.table(transactions);
    
    console.log('');
    console.log('🔑 User ID to check in app:', userId);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugUserData();
