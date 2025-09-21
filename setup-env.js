#!/usr/bin/env node

/**
 * Environment Setup Helper
 * This script helps you set up your environment variables
 */

const fs = require('fs');
const path = require('path');

const envContent = `# Clerk Authentication - REPLACE WITH YOUR ACTUAL KEYS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/career_genius_db"

# Google Gemini AI - REPLACE WITH YOUR ACTUAL KEY
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Inngest (Optional)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
`;

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔧 Setting up environment variables...\n');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists');
  console.log('📝 Please update your existing .env.local file with valid Clerk keys\n');
} else {
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file');
    console.log('📝 Please update the file with your actual API keys\n');
  } catch (error) {
    console.log('❌ Could not create .env.local file');
    console.log('📝 Please create it manually with the following content:\n');
    console.log(envContent);
  }
}

console.log('🚀 Next steps:');
console.log('1. Go to https://dashboard.clerk.com/');
console.log('2. Create a free account and new application');
console.log('3. Copy your Publishable Key and Secret Key');
console.log('4. Update .env.local with your actual keys');
console.log('5. Restart your development server (npm run dev)');
console.log('\n💡 Your app will work with fallback content even without API keys!');
