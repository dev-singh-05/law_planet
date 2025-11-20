// Database Types
export interface Profile {
  id: string;
  full_name: string;
  role: 'client' | 'lawyer' | 'admin';
  phone?: string;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LawyerDetails {
  id: string;
  bar_council_id: string;
  court_level?: 'Supreme Court' | 'High Court' | 'District Court' | 'Tribunals';
  specialization?: string;
  experience_years: number;
  education?: string;
  district?: string;
  state?: string;
  languages?: string[];
  bio?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LawyerWithProfile extends LawyerDetails {
  profile: Profile;
}

export interface Booking {
  id: string;
  client_id: string;
  lawyer_id: string;
  scheduled_at: string;
  mode: 'online' | 'offline' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  case_category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingWithDetails extends Booking {
  client: Profile;
  lawyer: Profile;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category?: string;
  tag?: string;
  published_on: string;
  created_at: string;
  updated_at: string;
}

export interface AIChat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatWithMessages extends AIChat {
  messages: AIMessage[];
}
