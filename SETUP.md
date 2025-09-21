# Career Genius - Setup Guide

## 🚀 Quick Start

Your Career Genius application is now fully functional! Here's what you need to do to get it running:

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication (Required for user management)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Database (Already configured)
DATABASE_URL="postgresql://username:password@localhost:5432/career_genius_db"

# Google Gemini AI (Required for AI features)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Inngest (Optional - for background jobs)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### 2. Get Your API Keys

#### Clerk Authentication
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com/)
2. Create a free account and new application
3. Copy your API keys from the dashboard
4. Update your `.env.local` file

#### Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 3. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Features Available

### ✅ Working Features
- **User Authentication** - Sign up/Sign in with Clerk
- **User Onboarding** - Industry selection and profile setup
- **Dashboard** - Industry insights and analytics
- **Resume Builder** - AI-powered resume creation
- **Cover Letter Generator** - Personalized cover letters
- **Interview Preparation** - Mock interviews and assessments
- **Database Integration** - PostgreSQL with Prisma ORM

### 🔧 Fallback Features
- **AI Features** - Work with fallback content when API keys are not configured
- **Error Handling** - Graceful degradation when services are unavailable

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio

# Linting
npm run lint
```

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   └── data/              # Static data files
├── components/            # Reusable UI components
├── actions/               # Server actions
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in `.env.local`
   - Run `npx prisma db push` to sync schema

2. **Authentication Not Working**
   - Verify Clerk keys are correct
   - Check that keys are properly set in `.env.local`
   - Ensure the application URL matches your Clerk configuration

3. **AI Features Not Working**
   - Add your Google Gemini API key to `.env.local`
   - Features will work with fallback content if API key is missing

4. **Build Errors**
   - Run `npm run lint` to check for issues
   - Ensure all dependencies are installed with `npm install`

## 🎉 You're All Set!

Your Career Genius application is now fully functional. Users can:
- Sign up and complete onboarding
- Build AI-powered resumes
- Generate personalized cover letters
- Practice interview questions
- View industry insights and analytics

The application gracefully handles missing API keys and provides fallback content, so it works even without full configuration.
