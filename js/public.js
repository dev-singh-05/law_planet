/**
 * LawPlanet Public Site JavaScript
 * Handles navigation, filtering, profile management, and interactivity
 */

// ============================================
// DATA
// ============================================

// Dummy lawyers data
const lawyersData = [
  {
    id: 1,
    name: "Adv. Priya Sharma",
    city: "Delhi",
    practiceAreas: ["Family", "Divorce"],
    experience: 7,
    description: "Specializes in family law and divorce matters with a compassionate approach",
    phone: "+91 98XXX XXXXX",
    email: "priya.sharma@example.com"
  },
  {
    id: 2,
    name: "Adv. Rajesh Kumar",
    city: "Mumbai",
    practiceAreas: ["Corporate", "Tax"],
    experience: 12,
    description: "Expert in corporate law and tax compliance for businesses",
    phone: "+91 97XXX XXXXX",
    email: "rajesh.kumar@example.com"
  },
  {
    id: 3,
    name: "Adv. Anita Desai",
    city: "Bengaluru",
    practiceAreas: ["Property", "Civil"],
    experience: 5,
    description: "Handles property disputes and civil litigation with expertise",
    phone: "+91 96XXX XXXXX",
    email: "anita.desai@example.com"
  },
  {
    id: 4,
    name: "Adv. Vikram Singh",
    city: "Delhi",
    practiceAreas: ["Criminal", "Constitutional"],
    experience: 15,
    description: "Senior advocate specializing in criminal and constitutional law",
    phone: "+91 95XXX XXXXX",
    email: "vikram.singh@example.com"
  },
  {
    id: 5,
    name: "Adv. Meera Patel",
    city: "Ahmedabad",
    practiceAreas: ["Family", "Property"],
    experience: 8,
    description: "Experienced in family law and property transactions",
    phone: "+91 94XXX XXXXX",
    email: "meera.patel@example.com"
  },
  {
    id: 6,
    name: "Adv. Arjun Reddy",
    city: "Hyderabad",
    practiceAreas: ["Civil", "Labour"],
    experience: 10,
    description: "Expertise in civil litigation and labour law disputes",
    phone: "+91 93XXX XXXXX",
    email: "arjun.reddy@example.com"
  },
  {
    id: 7,
    name: "Adv. Sneha Iyer",
    city: "Chennai",
    practiceAreas: ["Corporate", "IPR"],
    experience: 6,
    description: "Specializes in corporate law and intellectual property rights",
    phone: "+91 92XXX XXXXX",
    email: "sneha.iyer@example.com"
  },
  {
    id: 8,
    name: "Adv. Amit Ghosh",
    city: "Kolkata",
    practiceAreas: ["Criminal", "Civil"],
    experience: 20,
    description: "Veteran criminal lawyer with extensive trial experience",
    phone: "+91 91XXX XXXXX",
    email: "amit.ghosh@example.com"
  }
];

// Dummy news data
const newsData = [
  {
    id: 1,
    title: "Supreme Court Issues New Guidelines on Data Privacy",
    category: "Supreme Court",
    date: "2025-11-18",
    summary: "The Supreme Court of India has issued comprehensive guidelines on data privacy, emphasizing the importance of protecting citizens' personal information in the digital age.",
    content: "In a landmark judgment, the Supreme Court has laid down detailed guidelines for data protection, requiring companies to obtain explicit consent before collecting personal data. The court emphasized that privacy is a fundamental right and must be protected with stringent measures. Organizations failing to comply may face severe penalties including hefty fines and potential criminal prosecution."
  },
  {
    id: 2,
    title: "New Consumer Protection Rules for E-Commerce Platforms",
    category: "Policy",
    date: "2025-11-16",
    summary: "The Ministry of Consumer Affairs has introduced new rules to enhance consumer protection on e-commerce platforms, addressing fake reviews and misleading advertisements.",
    content: "The government has notified new consumer protection rules specifically targeting e-commerce platforms. These rules mandate clear disclosure of country of origin, improved grievance redressal mechanisms, and strict action against fake reviews. E-commerce entities will now be held accountable for ensuring product authenticity and timely delivery."
  },
  {
    id: 3,
    title: "Delhi High Court Fast-Tracks Property Dispute Resolution",
    category: "High Court",
    date: "2025-11-14",
    summary: "Delhi High Court announces special benches to expedite resolution of property-related cases, aiming to reduce backlog significantly.",
    content: "In a move to address the mounting backlog of property disputes, the Delhi High Court has constituted special benches dedicated exclusively to property matters. These benches will operate on an expedited timeline with strict adherence to procedural schedules. The initiative is expected to resolve pending cases within 12-18 months."
  },
  {
    id: 4,
    title: "Parliament Passes Amendment to IT Act for Cybersecurity",
    category: "Parliament",
    date: "2025-11-12",
    summary: "Parliament approves amendments to strengthen cybersecurity provisions and enhance penalties for cybercrimes.",
    content: "The Parliament has passed significant amendments to the Information Technology Act, 2000, introducing stricter penalties for cybercrimes including data breaches, identity theft, and online fraud. The amendments also establish a dedicated cybersecurity agency to monitor and prevent cyber threats at the national level."
  },
  {
    id: 5,
    title: "Supreme Court Ruling on Environmental Protection",
    category: "Supreme Court",
    date: "2025-11-10",
    summary: "Apex court mandates stricter environmental norms for industrial projects, prioritizing ecological balance.",
    content: "The Supreme Court has delivered a crucial judgment mandating comprehensive environmental impact assessments for all major industrial projects. The court emphasized that economic development cannot come at the cost of environmental degradation and directed states to ensure strict compliance with environmental protection laws."
  },
  {
    id: 6,
    title: "New Guidelines for Arbitration Proceedings",
    category: "Policy",
    date: "2025-11-08",
    summary: "Government issues revised guidelines to streamline arbitration proceedings and reduce litigation time.",
    content: "The Ministry of Law and Justice has released updated guidelines for arbitration proceedings, aiming to make the process more efficient and time-bound. The new guidelines emphasize digital hearings, strict timelines, and reduced costs, making arbitration a more attractive alternative to traditional litigation."
  }
];

// ============================================
// NAVIGATION
// ============================================

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

// Section navigation
function navigateTo(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });

  // Close mobile menu
  navMenu.classList.remove('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Nav link click handlers
document.querySelectorAll('.nav-link[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    navigateTo(sectionId);
  });
});

// ============================================
// HOME SECTION - NEWS PREVIEW
// ============================================

function loadNewsPreview() {
  const container = document.getElementById('newsPreview');
  if (!container) return;

  const latestNews = newsData.slice(0, 3);

  container.innerHTML = latestNews.map(news => `
    <div class="news-preview-card" onclick="openNewsModal(${news.id})">
      <div class="news-meta">
        <span class="news-category-badge">${news.category}</span>
        <span class="news-date-small">${formatDate(news.date)}</span>
      </div>
      <h4>${news.title}</h4>
      <p>${news.summary}</p>
    </div>
  `).join('');
}

// ============================================
// FIND A LAWYER SECTION
// ============================================

let filteredLawyers = [...lawyersData];

function renderLawyers() {
  const grid = document.getElementById('lawyersGrid');
  if (!grid) return;

  if (filteredLawyers.length === 0) {
    grid.innerHTML = '<p class="empty-message">No lawyers found matching your criteria. Try adjusting your filters.</p>';
    return;
  }

  grid.innerHTML = filteredLawyers.map(lawyer => `
    <div class="lawyer-card">
      <div class="lawyer-header">
        <h3>${lawyer.name}</h3>
        <p class="lawyer-location">📍 ${lawyer.city}</p>
      </div>
      <div class="lawyer-info">
        <p><strong>Practice Areas:</strong> ${lawyer.practiceAreas.join(', ')}</p>
        <p><strong>Experience:</strong> ${lawyer.experience}+ years</p>
      </div>
      <p class="lawyer-description">"${lawyer.description}"</p>
      <div class="lawyer-actions">
        <button class="btn btn-secondary" onclick="viewLawyerProfile(${lawyer.id})">View Profile</button>
        <button class="btn btn-primary" onclick="contactLawyer(${lawyer.id})">Contact</button>
      </div>
    </div>
  `).join('');
}

function filterLawyers() {
  const city = document.getElementById('cityFilter').value;
  const practice = document.getElementById('practiceFilter').value;
  const name = document.getElementById('nameFilter').value.toLowerCase();

  filteredLawyers = lawyersData.filter(lawyer => {
    const cityMatch = !city || lawyer.city === city;
    const practiceMatch = !practice || lawyer.practiceAreas.includes(practice);
    const nameMatch = !name || lawyer.name.toLowerCase().includes(name);
    return cityMatch && practiceMatch && nameMatch;
  });

  renderLawyers();
}

function viewLawyerProfile(lawyerId) {
  const lawyer = lawyersData.find(l => l.id === lawyerId);
  if (!lawyer) return;

  const modal = document.getElementById('lawyerModal');
  const content = document.getElementById('lawyerModalContent');

  content.innerHTML = `
    <div class="lawyer-profile-modal">
      <h2>${lawyer.name}</h2>
      <p class="lawyer-location" style="font-size: 1.1rem; margin-bottom: 1.5rem;">📍 ${lawyer.city}</p>

      <div class="modal-section">
        <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Practice Areas</h3>
        <p>${lawyer.practiceAreas.join(', ')}</p>
      </div>

      <div class="modal-section">
        <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Experience</h3>
        <p>${lawyer.experience}+ years of legal practice</p>
      </div>

      <div class="modal-section">
        <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">About</h3>
        <p>${lawyer.description}</p>
      </div>

      <div class="modal-section">
        <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Contact Information</h3>
        <p><strong>Email:</strong> ${lawyer.email}</p>
        <p><strong>Phone:</strong> ${lawyer.phone}</p>
      </div>

      <button class="btn btn-primary btn-block" onclick="contactLawyer(${lawyer.id}); closeLawyerModal();">Contact Now</button>
    </div>
  `;

  modal.classList.add('active');
}

function closeLawyerModal() {
  document.getElementById('lawyerModal').classList.remove('active');
}

function contactLawyer(lawyerId) {
  const lawyer = lawyersData.find(l => l.id === lawyerId);
  if (lawyer) {
    alert(`Contacting ${lawyer.name}\\n\\nIn a real application, this would open a contact form or messaging interface.\\n\\nEmail: ${lawyer.email}\\nPhone: ${lawyer.phone}`);
    navigateTo('contact');
  }
}

// ============================================
// NEWS SECTION
// ============================================

let currentNewsFilter = 'all';

function renderNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  const filteredNews = currentNewsFilter === 'all'
    ? newsData
    : newsData.filter(news => news.category === currentNewsFilter);

  grid.innerHTML = filteredNews.map(news => `
    <div class="news-card" onclick="openNewsModal(${news.id})">
      <div class="news-card-header">
        <h3>${news.title}</h3>
        <span class="news-card-date">${formatDate(news.date)}</span>
      </div>
      <span class="news-category-badge">${news.category}</span>
      <p class="news-card-summary">${news.summary}</p>
      <a href="#" class="news-card-read-more" onclick="event.stopPropagation(); openNewsModal(${news.id})">Read more →</a>
    </div>
  `).join('');
}

function filterNews(category) {
  currentNewsFilter = category;

  // Update category tags
  document.querySelectorAll('.category-tag').forEach(tag => {
    tag.classList.remove('active');
    if (tag.getAttribute('data-category') === category) {
      tag.classList.add('active');
    }
  });

  renderNews();
}

function openNewsModal(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  const modal = document.getElementById('newsModal');
  const content = document.getElementById('newsModalContent');

  content.innerHTML = `
    <div class="news-detail-modal">
      <span class="news-category-badge" style="margin-bottom: 1rem;">${news.category}</span>
      <h2 style="color: var(--primary-color); margin-bottom: 0.5rem;">${news.title}</h2>
      <p style="color: var(--text-light); margin-bottom: 1.5rem;">${formatDate(news.date)}</p>
      <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-dark);">${news.content}</p>
    </div>
  `;

  modal.classList.add('active');
}

function closeNewsModal() {
  document.getElementById('newsModal').classList.remove('active');
}

// ============================================
// PROFILE SECTION
// ============================================

function loadProfile() {
  const savedProfile = localStorage.getItem('lawplanetProfile');

  if (savedProfile) {
    const profile = JSON.parse(savedProfile);

    // Populate form
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profileCity').value = profile.city || '';
    document.getElementById('profileType').value = profile.type || 'Client';
    document.getElementById('profileBio').value = profile.bio || '';
    document.getElementById('profileInterests').value = profile.interests || '';

    // Update display
    updateProfileDisplay(profile);
  }
}

function updateProfileDisplay(profile) {
  const name = profile.name || 'Guest User';
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2) || 'U';

  document.getElementById('profileAvatarLarge').textContent = initials;
  document.getElementById('displayName').textContent = name;
  document.getElementById('displayType').textContent = profile.type || 'Client';
  document.getElementById('displayEmail').textContent = profile.email || 'Not set';
  document.getElementById('displayCity').textContent = profile.city || 'Not set';
  document.getElementById('displayBio').textContent = profile.bio || 'Not set';
  document.getElementById('displayInterests').textContent = profile.interests || 'Not set';
}

// Profile form submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const profile = {
      name: document.getElementById('profileName').value,
      email: document.getElementById('profileEmail').value,
      city: document.getElementById('profileCity').value,
      type: document.getElementById('profileType').value,
      bio: document.getElementById('profileBio').value,
      interests: document.getElementById('profileInterests').value
    };

    localStorage.setItem('lawplanetProfile', JSON.stringify(profile));
    updateProfileDisplay(profile);

    alert('Profile saved successfully!');
  });
}

// ============================================
// CONTACT SECTION
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // In a real app, this would send to a server
    console.log('Contact form submitted:', { name, email, subject, message });

    // Show success message
    const successDiv = document.getElementById('contactSuccess');
    successDiv.style.display = 'block';

    // Reset form
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 5000);
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Load initial content
  loadNewsPreview();
  renderLawyers();
  renderNews();
  loadProfile();

  // Check URL hash for direct navigation
  const hash = window.location.hash.substring(1);
  if (hash) {
    navigateTo(hash);
  }
});

// ============================================
// GLOBAL FUNCTIONS (exposed for onclick handlers)
// ============================================

window.navigateTo = navigateTo;
window.filterLawyers = filterLawyers;
window.viewLawyerProfile = viewLawyerProfile;
window.closeLawyerModal = closeLawyerModal;
window.contactLawyer = contactLawyer;
window.filterNews = filterNews;
window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;
