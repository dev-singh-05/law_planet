# LawPlanet Public Site 🏛️⚖️

A complete, modern informational website for legal help in India. This is a **frontend-only** educational portal built with vanilla HTML, CSS, and JavaScript.

## 🌟 Overview

LawPlanet is an informational platform that helps Indian citizens:
- Learn about the Indian legal system
- Find qualified lawyers by location and specialization
- Stay updated with legal news and developments
- Understand their fundamental rights and important laws

**Important:** This is a demo/informational platform. It is NOT a law firm and does not provide legal advice or representation.

## 📁 File Structure

```
law_planet/
├── home.html              # Main landing page (Single Page Application)
├── css/
│   └── public.css        # Complete styling for the public site
├── js/
│   └── public.js         # All interactivity and data management
└── PUBLIC_SITE_README.md # This file
```

## 🚀 How to Run

### Option 1: Open Directly
Simply open `home.html` in your web browser.

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000/home.html`

## 📱 Features

### 1. Home/Dashboard
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **Dashboard Cards**: Quick navigation to all major sections
- **Latest News Preview**: Shows 3 recent legal news items
- **Quick Law Facts**: Educational tidbits about Indian law

### 2. Find a Lawyer
- **Advanced Filters**: Search by city, practice area, and name
- **Lawyer Cards**: Detailed lawyer profiles with experience and specializations
- **View Profile Modal**: Complete lawyer information
- **Contact Options**: Direct contact buttons (demo)

**Dummy Data**: Includes 8 sample lawyers across major Indian cities

### 3. Law News
- **Category Filtering**: Filter by Supreme Court, High Court, Parliament, Policy
- **News Cards**: Headlines with summaries
- **Detailed View**: Click any news item to read full content in a modal

**Dummy Data**: 6 sample news articles with Indian legal context

### 4. Indian Law Basics
Educational content including:
- **Court Structure**: Visual hierarchy from District Courts → High Courts → Supreme Court
- **Branches of Law**: Civil, Criminal, Constitutional, Family, Property, Corporate, Tax, Labour
- **Fundamental Rights**: All 6 fundamental rights explained
- **Important Acts**: IPC, CrPC, Evidence Act, IT Act, Consumer Protection Act, RTI Act

### 5. About Us
- Mission and vision of LawPlanet
- "How It Works" in 4 simple steps
- Team section with 3 dummy team members

### 6. My Profile
- **LocalStorage Integration**: All data saved in browser
- **Profile Form**: Name, email, city, type (Client/Lawyer), bio, interests
- **Live Preview**: Profile card updates instantly
- **Persistent Data**: Survives page refreshes

### 7. Contact & Helpline
- **Contact Form**: Fully functional with client-side validation
- **Success Toast**: Shows confirmation when message is sent
- **Helpline Numbers**: Example numbers with disclaimer
- **Important Links**: Cybercrime, Women's Helpline, Legal Aid, etc.

## 🎨 Design Features

### Color Scheme
- **Primary**: Dark Blue (#1e3a8a) - Professional and trustworthy
- **Secondary**: Teal (#0ea5e9) - Modern and accessible
- **Accent**: Gold (#f59e0b) - Indian cultural touch
- **Background**: Light gray (#f9fafb) - Easy on eyes

### Typography
- **Font**: Inter (Google Fonts) - Modern and readable
- **Hierarchy**: Clear heading structure (h1-h4)
- **Line Height**: 1.6-1.8 for comfortable reading

### Responsiveness
- **Mobile First**: Works perfectly on phones (320px+)
- **Tablet Optimized**: Adapts layouts for tablets
- **Desktop Enhanced**: Takes advantage of larger screens
- **Breakpoints**: 480px, 768px

### Interactions
- **Smooth Transitions**: 0.3s ease on all interactive elements
- **Hover States**: Visual feedback on buttons, cards, links
- **Active States**: Clear indication of current section/filter
- **Modal Overlays**: For lawyer profiles and news details

## 💻 Technical Details

### HTML Structure
- **Semantic HTML5**: Proper use of header, nav, section, article, footer
- **Accessibility**: ARIA labels, alt text, semantic structure
- **SEO Friendly**: Proper heading hierarchy and meta tags

### CSS Architecture
- **CSS Variables**: Consistent theming throughout
- **Flexbox & Grid**: Modern layout techniques
- **Mobile-First**: Media queries for responsive design
- **No Framework**: Pure CSS, no Bootstrap or Tailwind

### JavaScript Features
- **ES6+**: Modern JavaScript (arrow functions, template literals, destructuring)
- **No Dependencies**: Vanilla JavaScript only
- **LocalStorage API**: Profile data persistence
- **Event Delegation**: Efficient event handling
- **Modular Code**: Well-organized functions

## 🔧 Customization

### Adding More Lawyers
Edit the `lawyersData` array in `js/public.js`:

```javascript
const lawyersData = [
  {
    id: 9,
    name: "Your Lawyer Name",
    city: "City",
    practiceAreas: ["Area1", "Area2"],
    experience: 5,
    description: "Description here",
    phone: "+91 XXXXX XXXXX",
    email: "email@example.com"
  },
  // ... more lawyers
];
```

### Adding More News
Edit the `newsData` array in `js/public.js`:

```javascript
const newsData = [
  {
    id: 7,
    title: "Your News Title",
    category: "Supreme Court", // or "High Court", "Parliament", "Policy"
    date: "2025-11-20",
    summary: "Short summary...",
    content: "Full content..."
  },
  // ... more news
];
```

### Changing Colors
Modify CSS variables in `css/public.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --accent-color: #your-color;
}
```

### Adding New Sections
1. Add a new `<section>` in `home.html` with `id="your-section"`
2. Add navigation link with `data-section="your-section"`
3. Style it in `css/public.css`
4. Add any interactivity in `js/public.js`

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy & Data

- **No Backend**: All data stays in your browser
- **LocalStorage Only**: Profile data stored locally
- **No Cookies**: No tracking or analytics
- **No External API Calls**: Completely offline-capable after first load

## ⚠️ Disclaimer

**IMPORTANT**: LawPlanet is a demonstration/informational platform only. It is:

- ❌ NOT a law firm
- ❌ NOT providing legal advice
- ❌ NOT handling real legal cases
- ❌ NOT collecting or storing user data on servers

For actual legal assistance, please contact a qualified lawyer. All lawyer profiles and news articles are dummy data for demonstration purposes.

## 🎯 Use Cases

### Educational
- Learning resource for law students
- Understanding Indian legal system
- Knowing fundamental rights

### Informational
- Finding lawyers by specialization
- Staying updated with legal news
- Understanding court structure

### Demonstration
- Frontend development portfolio
- UI/UX design showcase
- Vanilla JavaScript skills

## 🚧 Future Enhancements (Not Implemented)

- Real lawyer database integration
- Live legal news API
- User authentication system
- Lawyer ratings and reviews
- Appointment booking
- Document upload
- Multi-language support
- Dark mode

## 📝 License

This is a demonstration project. Feel free to use it for learning purposes.

## 🤝 Contributing

This is a demo project, but suggestions are welcome!

---

**Built with ❤️ for the Indian legal community**

For actual legal help, please consult a qualified lawyer or visit:
- Supreme Court of India: https://www.sci.gov.in
- Bar Council of India: https://www.barcouncilofindia.org
- National Legal Services Authority: https://nalsa.gov.in
