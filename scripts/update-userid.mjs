#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function updateUserIds() {
  const oldUserId = "user_sample_123";
  const newUserId = process.argv[2];
  
  if (!newUserId) {
    console.log('❌ Please provide your Clerk user ID as an argument');
    console.log('   Usage: npm run db:update-userid YOUR_CLERK_USER_ID');
    console.log('');
    console.log('💡 To get your Clerk user ID:');
    console.log('   1. Sign up/sign in at http://localhost:3000');
    console.log('   2. Open browser dev tools (F12)');
    console.log('   3. Go to Console tab');
    console.log('   4. Type: window.Clerk?.user?.id');
    console.log('   5. Copy the returned user ID');
    process.exit(1);
  }
  
  try {
    console.log('🔄 Updating user IDs in database...');
    console.log(`   From: ${oldUserId}`);
    console.log(`   To: ${newUserId}`);
    
    // Update accounts
    const accountsResult = await sql`
      UPDATE accounts SET user_id = ${newUserId} WHERE user_id = ${oldUserId}
    `;
    
    // Update categories
    const categoriesResult = await sql`
      UPDATE categories SET user_id = ${newUserId} WHERE user_id = ${oldUserId}
    `;
    
    console.log('✅ User IDs updated successfully!');
    console.log(`   Updated ${accountsResult.length} accounts`);
    console.log(`   Updated ${categoriesResult.length} categories`);
    console.log('');
    console.log('🎉 You should now be able to see and manage data in the app!');
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateUserIds();
