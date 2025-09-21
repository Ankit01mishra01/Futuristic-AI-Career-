#!/usr/bin/env node

/**
 * Database Setup Script
 * This script helps set up the database for the Career Genius application
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Setting up Career Genius database...\n');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if we can query the database
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);

    // Check if we can query industry insights
    const industryCount = await prisma.industryInsight.count();
    console.log(`📊 Current industry insights: ${industryCount}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Set up your environment variables in .env.local');
    console.log('2. Configure your Clerk authentication keys');
    console.log('3. Add your Google Gemini API key for AI features');
    console.log('4. Run "npm run dev" to start the development server');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env.local');
    console.log('3. Run "npx prisma db push" to sync your schema');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
