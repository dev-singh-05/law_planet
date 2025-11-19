# LawPlanet 🏛️⚖️

**LawPlanet** is a modern web platform connecting clients with qualified lawyers across India. Built with vanilla JavaScript, HTML, CSS, and Supabase for backend services.

## 🌟 Features

### For Clients
- 🔐 Sign up and create a profile
- 🔍 Browse and search lawyers by city, practice area, and experience
- 👁️ View detailed lawyer profiles including cases, specializations, and fees
- 💬 Start 1-to-1 chat conversations with lawyers
- 📱 Real-time messaging

### For Lawyers
- 🔐 Professional signup with Bar Council ID verification
- 📋 Manage detailed professional profile (practice areas, courts, fees)
- 📁 Add and manage case portfolio
- 💼 Showcase experience and specializations
- 💬 Chat with clients in real-time
- 🏆 Build credibility with case history

## 🚀 Quick Start

### Prerequisites
- A Supabase account (free tier works fine)
- A web browser
- A local development server (e.g., VS Code Live Server, Python's http.server, or npx serve)

### Setup Instructions

#### Step 1: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new organization (if you don't have one)
   - Create a new project
   - Wait for the project to finish setting up (usually 1-2 minutes)

2. **Run the Database Migration**
   - In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the entire contents of `supabase_migration.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the migration
   - You should see "Success. No rows returned" if everything worked correctly

3. **Get Your API Credentials**
   - Click on "Settings" (gear icon) in the left sidebar
   - Click on "API" under "Project Settings"
   - Copy your:
     - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
     - **anon/public key** (a long JWT token)

#### Step 2: Configure the Application

1. **Update Supabase Credentials**
   - Open `js/supabaseClient.js`
   - Replace the placeholder values with your actual credentials:
     ```javascript
     const SUPABASE_URL = "YOUR_PROJECT_URL_HERE";
     const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";
     ```

#### Step 3: Run the Application

1. **Start a Local Server**

   Choose one of the following methods:

   **Option A: VS Code Live Server**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"

   **Option B: Python**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open `http://localhost:8000` in your browser

   **Option C: Node.js (npx serve)**
   ```bash
   npx serve
   ```
   Then open the URL shown in the terminal

2. **Open the Application**
   - Navigate to `http://localhost:8000` (or whatever port your server is using)
   - You should see the LawPlanet landing page

## 📖 Usage Guide

### Creating Test Accounts

#### Client Account
1. Click "I am a Client"
2. Click "Sign Up"
3. Fill in your details:
   - Full Name
   - Email
   - Password
   - City
4. Click "Sign Up"
5. You'll be redirected to the dashboard

#### Lawyer Account
1. Click "I am a Lawyer"
2. Click "Sign Up"
3. Fill in your details:
   - Full Name
   - Email
   - Password
   - City
   - Bar Council ID (e.g., `D/1234/2020`)
   - Primary Practice Area
   - Years of Experience
4. Click "Sign Up"
5. Complete your lawyer profile in the dashboard

### As a Client

1. **Find Lawyers**
   - Click "Find Lawyers" in the sidebar
   - Use filters to search by city, practice area, or experience
   - Click "View Profile" to see detailed lawyer information
   - Click "Chat Now" to start a conversation

2. **Chat with Lawyers**
   - Go to "My Chats" to see all conversations
   - Click on a conversation to open the chat
   - Messages are delivered in real-time

### As a Lawyer

1. **Update Your Profile**
   - Click "My Profile" to update basic information
   - Click "Lawyer Profile" to update professional details
   - Add practice areas, courts, consultation fees, and bio

2. **Manage Cases**
   - Click "My Cases" in the sidebar
   - Add cases using the form
   - View, edit, or mark cases as closed
   - Cases are visible to clients viewing your profile

3. **Chat with Clients**
   - Click "Client Chats" to see all conversations
   - Respond to client inquiries in real-time

## 🏗️ Project Structure

```
law_planet/
├── index.html              # Landing page with authentication
├── dashboard.html          # Role-based dashboard
├── chat.html              # Real-time chat interface
├── styles.css             # All styling (mobile-responsive)
├── js/
│   ├── supabaseClient.js  # Supabase configuration
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   ├── chat.js            # Real-time messaging
│   └── utils.js           # Helper functions
├── supabase_migration.sql # Database schema and RLS policies
└── README.md              # This file
```

## 🗄️ Database Schema

### Tables

1. **profiles** - User profiles for both clients and lawyers
2. **lawyer_details** - Additional information for lawyers
3. **cases** - Lawyer's case portfolio
4. **conversations** - 1-to-1 chat conversations
5. **messages** - Chat messages

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Profiles and lawyer information are public for browsing
- Messages are restricted to conversation participants

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color Scheme**: Professional dark blue and navy with gold/teal accents
- **Modern UI**: Clean cards, smooth transitions, and intuitive navigation
- **Indian Context**: INR currency, Indian cities, Bar Council IDs, Indian courts

## 🔒 Security Notes

- ⚠️ **This is a demo application** - not intended for production use
- All authentication is handled securely by Supabase
- Passwords are hashed and never stored in plain text
- Row Level Security policies prevent unauthorized data access
- Always validate and sanitize user input in production applications

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime)
- **No Frameworks**: Pure JavaScript - no React, Angular, or Vue
- **No Build Tools**: No webpack, no compilation - just open and run

## 🐛 Troubleshooting

### "Failed to fetch" or Network Errors
- Check that your Supabase URL and anon key are correct in `js/supabaseClient.js`
- Ensure your Supabase project is running (check the Supabase dashboard)
- Verify that the database migration ran successfully

### Authentication Issues
- Clear your browser's local storage and cookies
- Make sure you ran the SQL migration completely
- Check the Supabase Authentication dashboard for user records

### Real-time Messages Not Working
- Ensure the messages table is added to the realtime publication (included in migration)
- Check browser console for errors
- Verify that both users are logged in and in the same conversation

### RLS Policy Errors
- Make sure all RLS policies were created successfully
- Check the Supabase SQL Editor logs for any errors during migration
- Verify that users are properly authenticated before accessing data

## 📝 Sample Data

### Indian Cities Included
Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh

### Practice Areas
Civil, Criminal, Family, Property, Corporate, Tax, Labour, Constitutional, IPR, Consumer

### Sample Bar Council ID Format
- `D/1234/2020` (Delhi)
- `M/5678/2018` (Maharashtra)
- `K/9012/2019` (Karnataka)

## 🚧 Future Enhancements (Not Implemented)

- Document upload and sharing
- Video consultation scheduling
- Payment integration
- Lawyer ratings and reviews
- Advanced search with filters
- Email notifications
- Multi-language support
- Calendar integration

## ⚖️ Legal Disclaimer

**IMPORTANT**: This is a demonstration application for educational purposes only. It is NOT a real legal service platform. Do not use this for actual legal advice or attorney-client relationships. Always consult with a licensed attorney for legal matters.

## 📄 License

This is a demo project. Feel free to use it for learning purposes.

## 🤝 Contributing

This is a demo project, but suggestions and improvements are welcome!

---

**Built with ❤️ for the Indian legal community**

For questions or issues, please refer to the troubleshooting section above.
