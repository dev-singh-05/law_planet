-- ============================================
-- Law Planet - Complete Database Schema
-- Next.js + Supabase Application
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'lawyer', 'admin')),
  phone TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LAWYER DETAILS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lawyer_details (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bar_council_id TEXT NOT NULL,
  court_level TEXT CHECK (court_level IN ('Supreme Court', 'High Court', 'District Court', 'Tribunals')),
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  education TEXT,
  district TEXT,
  state TEXT,
  languages TEXT[] DEFAULT '{}',
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'phone')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  case_category TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS ARTICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tag TEXT,
  published_on DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI CHATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES ai_chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_lawyer_details_district ON lawyer_details(district);
CREATE INDEX IF NOT EXISTS idx_lawyer_details_state ON lawyer_details(state);
CREATE INDEX IF NOT EXISTS idx_lawyer_details_specialization ON lawyer_details(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyer_details_court_level ON lawyer_details(court_level);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lawyer_id ON bookings(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_published_on ON news_articles(published_on);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_chat_id ON ai_messages(chat_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Everyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile, admins can update any profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- LAWYER DETAILS POLICIES
-- ============================================

-- Everyone can view lawyer details
CREATE POLICY "Lawyer details viewable by all"
  ON lawyer_details FOR SELECT
  USING (true);

-- Lawyers can insert their own details
CREATE POLICY "Lawyers can insert own details"
  ON lawyer_details FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Lawyers can update their own details, admins can update any
CREATE POLICY "Lawyers can update own details"
  ON lawyer_details FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

-- Users can view bookings where they are client or lawyer
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = client_id
    OR auth.uid() = lawyer_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Clients can create bookings
CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Clients and lawyers can update their bookings, admins can update any
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = client_id
    OR auth.uid() = lawyer_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can delete their own bookings
CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = client_id);

-- ============================================
-- NEWS ARTICLES POLICIES
-- ============================================

-- Everyone can view news
CREATE POLICY "News viewable by all"
  ON news_articles FOR SELECT
  USING (true);

-- Only admins can insert news
CREATE POLICY "Admins can insert news"
  ON news_articles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Only admins can update news
CREATE POLICY "Admins can update news"
  ON news_articles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Only admins can delete news
CREATE POLICY "Admins can delete news"
  ON news_articles FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- AI CHATS POLICIES
-- ============================================

-- Users can view their own chats
CREATE POLICY "Users can view own chats"
  ON ai_chats FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own chats
CREATE POLICY "Users can create own chats"
  ON ai_chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own chats
CREATE POLICY "Users can update own chats"
  ON ai_chats FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own chats
CREATE POLICY "Users can delete own chats"
  ON ai_chats FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- AI MESSAGES POLICIES
-- ============================================

-- Users can view messages in their chats
CREATE POLICY "Users can view own chat messages"
  ON ai_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM ai_chats WHERE id = chat_id AND user_id = auth.uid()
  ));

-- Users can create messages in their chats
CREATE POLICY "Users can create own chat messages"
  ON ai_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM ai_chats WHERE id = chat_id AND user_id = auth.uid()
  ));

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lawyer_details_updated_at
  BEFORE UPDATE ON lawyer_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE SETUP (for profile pictures)
-- ============================================

-- Create storage bucket for avatars (run this in Supabase Storage UI or via SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
-- CREATE POLICY "Avatar images are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload their own avatar"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can update their own avatar"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
