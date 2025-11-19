/**
 * Supabase Client Configuration
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with your own credentials
 */

const SUPABASE_URL = "https://doxmwjzgbphgynwcapfi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveG13anpnYnBoZ3lud2NhcGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDQ5MjksImV4cCI6MjA3OTA4MDkyOX0.O_lLhe3yXwmKOJ7R18oBinYslzEYOa1ShA_Z8r2toT0";

// Create Supabase client
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
