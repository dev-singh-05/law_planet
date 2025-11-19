-- ============================================
-- LawPlanet Database Migration
-- Complete schema for Indian lawyer-client platform
-- ============================================

-- PROFILES TABLE
-- Stores basic user information for both clients and lawyers
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'lawyer')),
  city TEXT,
  state TEXT,
  phone TEXT,
  languages TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LAWYER DETAILS TABLE
-- Additional information specific to lawyers
-- ============================================
CREATE TABLE IF NOT EXISTS lawyer_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bar_council_id TEXT NOT NULL,
  practice_areas TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  courts TEXT[] DEFAULT '{}',
  consultation_fee_inr INTEGER,
  consultation_mode TEXT CHECK (consultation_mode IN ('online', 'in_person', 'both')) DEFAULT 'online',
  about TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CASES TABLE
-- Stores lawyer's recent cases
-- ============================================
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  case_type TEXT,
  court TEXT,
  status TEXT NOT NULL CHECK (status IN ('ongoing', 'closed')) DEFAULT 'ongoing',
  start_date DATE,
  end_date DATE,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS TABLE
-- Stores 1-to-1 chat conversations between client and lawyer
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  UNIQUE(client_id, lawyer_id)
);

-- ============================================
-- MESSAGES TABLE
-- Stores individual chat messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer_id ON cases(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lawyer_id ON conversations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Everyone can view all profiles (for browsing lawyers/clients)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- LAWYER DETAILS POLICIES
-- ============================================

-- Everyone can view lawyer details (for browsing)
CREATE POLICY "Lawyer details are viewable by everyone"
  ON lawyer_details FOR SELECT
  USING (true);

-- Only lawyers can insert their own details
CREATE POLICY "Lawyers can insert their own details"
  ON lawyer_details FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Lawyers can update their own details
CREATE POLICY "Lawyers can update their own details"
  ON lawyer_details FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CASES POLICIES
-- ============================================

-- Everyone can view all cases
CREATE POLICY "Cases are viewable by everyone"
  ON cases FOR SELECT
  USING (true);

-- Only the owning lawyer can insert their cases
CREATE POLICY "Lawyers can insert their own cases"
  ON cases FOR INSERT
  WITH CHECK (auth.uid() = lawyer_id);

-- Only the owning lawyer can update their cases
CREATE POLICY "Lawyers can update their own cases"
  ON cases FOR UPDATE
  USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);

-- Only the owning lawyer can delete their cases
CREATE POLICY "Lawyers can delete their own cases"
  ON cases FOR DELETE
  USING (auth.uid() = lawyer_id);

-- ============================================
-- CONVERSATIONS POLICIES
-- ============================================

-- Users can view conversations where they are a participant
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- Authenticated users can create conversations where they are a participant
CREATE POLICY "Users can create conversations they participate in"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Users can view messages in conversations they are part of
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.client_id = auth.uid() OR conversations.lawyer_id = auth.uid())
    )
  );

-- Users can insert messages in conversations they are part of
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.client_id = auth.uid() OR conversations.lawyer_id = auth.uid())
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lawyer_details_updated_at BEFORE UPDATE ON lawyer_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at when a message is sent
CREATE TRIGGER update_conversation_timestamp AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- REALTIME PUBLICATION (for chat)
-- ============================================

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
