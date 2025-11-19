# Law Planet - Complete Legal Services Platform 🏛️⚖️

A comprehensive, production-ready web application built with Next.js, TypeScript, and Supabase that connects clients with qualified lawyers across India.

## 🌟 Features

### For Clients
- 🔐 Secure authentication (Email/Password + Google OAuth)
- 🔍 Advanced lawyer search with filters (district, court level, specialization, experience)
- 👁️ Detailed lawyer profiles with education, experience, and reviews
- 📅 Book consultations (online/offline/phone)
- 💬 AI Legal Advisor for instant legal guidance
- 📰 Latest legal news and updates
- 👤 Profile management with booking history

### For Lawyers
- 📋 Comprehensive professional profile management
- 💼 Update practice details (court level, specialization, experience, education)
- 📬 Receive and manage consultation bookings
- ✅ Verification badge system
- 📊 View all client bookings and history

### For Administrators
- 📊 Complete dashboard with analytics
- 👥 User management (clients and lawyers)
- ✓ Lawyer verification and activation controls
- 📅 Booking management and status updates
- 📰 News article management (create, edit, delete)

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works perfectly)
- Git installed

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and click "New Project"
3. Fill in project details and wait for setup to complete

#### Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase_schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

#### Add Seed Data (Optional)

1. In SQL Editor, create a new query
2. Copy contents of `supabase_seed.sql`
3. Paste and run (this adds sample news articles)

#### Configure Google OAuth (Optional)

1. Go to **Authentication** → **Providers** in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials
4. Add authorized redirect URL: `http://localhost:3000/auth/callback`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Get your Supabase credentials:
   - Go to **Settings** → **API** in Supabase dashboard
   - Copy **Project URL**
   - Copy **anon/public key**

3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Structure

```
law-planet-nextjs/
├── app/                        # Next.js App Router pages
│   ├── about/                 # About Us page
│   ├── admin/                 # Admin Dashboard
│   ├── api/legal-ai/          # AI chat API endpoint
│   ├── auth/callback/         # OAuth callback
│   ├── find-a-lawyer/         # Lawyer search page
│   ├── lawyers/[id]/          # Individual lawyer profile
│   ├── legal-advice/          # AI Legal Advisor
│   ├── login/                 # Login page
│   ├── news/                  # Legal news page
│   ├── profile/               # User profile & bookings
│   ├── signup/                # Signup page
│   ├── layout.tsx             # Root layout with navbar
│   ├── page.tsx               # Home page
│   └── not-found.tsx          # 404 page
├── components/                 # Reusable components
│   └── Navbar.tsx             # Navigation component
├── lib/                       # Utilities & types
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   ├── server.ts          # Server Supabase client
│   │   └── middleware.ts      # Auth middleware
│   └── types.ts               # TypeScript types
├── supabase_schema.sql        # Database schema
├── supabase_seed.sql          # Seed data
└── middleware.ts              # Next.js middleware
```

## 🗄️ Database Schema

### Tables

1. **profiles** - User profiles (all roles)
2. **lawyer_details** - Additional lawyer information
3. **bookings** - Consultation bookings
4. **news_articles** - Legal news and updates
5. **ai_chats** - AI advisor chat sessions
6. **ai_messages** - AI chat messages

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have full access
- Public profiles and lawyer details for browsing

## 👥 User Roles

### Client
- Browse and search lawyers
- Book consultations
- Use AI legal advisor
- View profile and booking history

### Lawyer
- Complete professional profile
- Receive booking requests
- Update experience and education
- Manage availability

### Admin
- Full dashboard access
- Verify/activate lawyers
- Manage all bookings
- Manage news articles
- View analytics

## 🎯 Key Pages

### Home (/)
- Hero section with call-to-action
- Statistics showcase
- Services overview
- FAQ section

### Find a Lawyer (/find-a-lawyer)
- Advanced search filters
- District, court level, specialization
- Experience-based filtering
- Lawyer result cards with actions

### Lawyer Profile (/lawyers/[id])
- Complete lawyer information
- Education and qualifications
- Languages and location
- Booking modal

### Legal Advice (/legal-advice)
- AI-powered chat interface
- Saved chat history
- Prompt templates
- Mock AI responses (ready for real LLM integration)

### Profile (/profile)
- Personal information editing
- Password update
- Lawyer details (for lawyers)
- My Bookings section (Upcoming & History)

### Admin Dashboard (/admin)
- User statistics
- Lawyer management (verify/activate)
- Booking management
- News CRUD operations

## 🔐 Authentication Flow

1. User signs up with email/password or Google OAuth
2. Profile created in `profiles` table with selected role
3. If lawyer, can complete `lawyer_details` later
4. Session managed by Supabase Auth
5. Protected routes check user authentication and role

## 🤖 AI Legal Advisor

The AI Legal Advisor provides mock responses based on keywords. Ready for integration with:
- OpenAI GPT
- Google Gemini
- Anthropic Claude
- Any LLM API

Update `/app/api/legal-ai/route.ts` to connect your preferred AI service.

## 📧 Creating Test Users

### Client Account
1. Go to `/signup`
2. Fill in details and select "Client" role
3. Sign up and login

### Lawyer Account
1. Go to `/signup`
2. Fill in details and select "Lawyer" role
3. Sign up and login
4. Go to Profile and complete lawyer details

### Admin Account
1. Create a regular account
2. In Supabase dashboard → Table Editor → profiles
3. Find your user and change `role` to `'admin'`
4. Refresh the app and access `/admin`

## 🎨 Design Features

- Clean, modern UI with Tailwind CSS
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional color scheme (blue, teal, yellow accents)
- Accessibility-friendly
- Indian legal context (courts, laws, terminology)

## 📝 Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚨 Important Notes

- **NOT A LAW FIRM**: This is a platform connecting users with lawyers. It does NOT provide legal advice.
- **Demo Application**: Uses mock AI responses. Integrate real LLM for production.
- **RLS Enabled**: All database queries respect Row Level Security policies.

## 🔧 Customization

### Adding Real AI
Replace mock responses in `/app/api/legal-ai/route.ts` with your LLM API calls.

### Email Notifications
Add email service (SendGrid, Resend) to send booking confirmations.

## 📦 Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

Update Supabase Auth URLs with production URL in allowed redirect URLs.

## ⚖️ Legal Disclaimer

**Law Planet is NOT a law firm and does NOT provide legal advice.** This platform is for informational purposes only. Always consult with a licensed attorney for legal matters specific to your situation.

## 👨‍💻 Built By

- **Abhigyan Singh Thakur** - Founder
- **Anam Ali** - Technical Lead

---

Made with ❤️ for the Indian legal community
