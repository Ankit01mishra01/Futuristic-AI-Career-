# Career Genius - AI-Powered Career Development Platform

A comprehensive career development platform built with Next.js, featuring AI-powered resume building, cover letter generation, interview preparation, and industry insights.

## 🚀 Features

- **AI-Powered Resume Builder**: Create professional, ATS-optimized resumes with AI assistance
- **Smart Cover Letter Generator**: Generate personalized cover letters for job applications
- **Interview Preparation**: Practice with industry-specific questions and get performance analytics
- **Industry Insights**: Get real-time market data, salary ranges, and career trends
- **User Authentication**: Secure authentication with Clerk
- **Background Jobs**: Automated industry insights updates with Inngest
- **Responsive Design**: Modern, mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI**: Google Gemini API
- **Background Jobs**: Inngest
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account
- Google AI API key
- Inngest account (optional for background jobs)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd career-genius
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/career_genius_db"

# Google AI
GEMINI_API_KEY=your_gemini_api_key_here

# Inngest (Optional)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Clerk Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key to your `.env.local`
4. Set up webhooks for user management (optional)

### Google AI Setup

1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Add the key to your `.env.local` as `GEMINI_API_KEY`

### Database Setup

1. Create a PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`
3. Run database migrations

### Inngest Setup (Optional)

1. Create account at [inngest.com](https://inngest.com)
2. Get event key and signing key
3. Add to your `.env.local`

## 📁 Project Structure

```
career-genius/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   │   ├── dashboard/     # Industry insights dashboard
│   │   ├── resume/        # Resume builder
│   │   ├── interview/     # Interview preparation
│   │   └── ai-cover-letter/ # Cover letter generator
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
│   ├── prisma.js         # Database client
│   └── inngest/          # Background job functions
├── actions/               # Server actions
├── hooks/                 # Custom React hooks
└── prisma/               # Database schema
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `INNGEST_EVENT_KEY` (optional)
- `INNGEST_SIGNING_KEY` (optional)

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 API Endpoints

- `POST /api/ai/generate` - Generate AI content
- `POST /api/user/onboard` - User onboarding
- `POST /api/clerk/webhook` - Clerk webhooks
- `POST /api/inngest` - Inngest functions

## 🔒 Security

- Authentication handled by Clerk
- Server-side validation with Zod
- CSRF protection
- Rate limiting on AI endpoints
- Secure environment variable handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Job application tracking
- [ ] Networking features
- [ ] Mobile app
- [ ] Advanced AI features
- [ ] Multi-language support

---

Built with ❤️ using Next.js, Prisma, and Clerk