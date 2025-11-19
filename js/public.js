/**
 * LawPlanet Integrated Site JavaScript
 * Handles navigation, authentication, real Supabase data, and interactivity
 */

import { supabase } from './supabaseClient.js';
import { formatDate as utilFormatDate, formatSimpleDate, joinWithCommas } from './utils.js';

// ============================================
// GLOBAL STATE
// ============================================

let currentUser = null;
let currentProfile = null;
let isAuthenticated = false;

// ============================================
// DATA
// ============================================

// News data (static - in real app would come from API/DB)
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
// AUTHENTICATION
// ============================================

async function checkAuthentication() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      currentUser = user;
      isAuthenticated = true;

      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      currentProfile = profile;

      updateNavForAuthenticatedUser();
    } else {
      isAuthenticated = false;
      updateNavForGuestUser();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    isAuthenticated = false;
    updateNavForGuestUser();
  }
}

function updateNavForAuthenticatedUser() {
  const authLink = document.getElementById('authLink');
  const authButton = document.getElementById('navAuthButton');

  if (authLink && authButton) {
    authLink.textContent = 'Logout';
    authLink.className = 'nav-link nav-cta';
    authLink.href = '#';
    authLink.onclick = handleLogout;
  }

  // Show user name in nav if possible
  if (currentProfile && currentProfile.full_name) {
    const welcomeSpan = document.createElement('span');
    welcomeSpan.className = 'nav-link';
    welcomeSpan.style.cursor = 'default';
    welcomeSpan.textContent = `Hi, ${currentProfile.full_name.split(' ')[0]}`;
    authButton.parentNode.insertBefore(welcomeSpan, authButton);
  }
}

function updateNavForGuestUser() {
  const authLink = document.getElementById('authLink');

  if (authLink) {
    authLink.textContent = 'Login / Sign Up';
    authLink.className = 'nav-link nav-cta';
    authLink.href = 'index.html';
    authLink.onclick = null;
  }
}

async function handleLogout(e) {
  if (e) e.preventDefault();

  try {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to logout');
  }
}

window.handleLogout = handleLogout;

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
// FIND A LAWYER SECTION - REAL DATA FROM SUPABASE
// ============================================

let filteredLawyers = [];
let allLawyers = [];

async function loadLawyers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        lawyer_details (*)
      `)
      .eq('role', 'lawyer');

    if (error) throw error;

    allLawyers = data || [];
    filteredLawyers = [...allLawyers];
    renderLawyers();
  } catch (error) {
    console.error('Error loading lawyers:', error);
    const grid = document.getElementById('lawyersGrid');
    if (grid) {
      grid.innerHTML = '<p class="empty-message">Unable to load lawyers. Please try again later.</p>';
    }
  }
}

function renderLawyers() {
  const grid = document.getElementById('lawyersGrid');
  if (!grid) return;

  if (filteredLawyers.length === 0) {
    grid.innerHTML = '<p class="empty-message">No lawyers found matching your criteria. Try adjusting your filters.</p>';
    return;
  }

  grid.innerHTML = filteredLawyers.map(lawyer => {
    const details = lawyer.lawyer_details || {};
    const practiceAreas = details.practice_areas || [];
    const experience = details.years_experience || 0;

    return `
      <div class="lawyer-card">
        <div class="lawyer-header">
          <h3>${lawyer.full_name || 'Lawyer'}</h3>
          <p class="lawyer-location">📍 ${lawyer.city || 'India'}</p>
        </div>
        <div class="lawyer-info">
          <p><strong>Practice Areas:</strong> ${practiceAreas.length > 0 ? practiceAreas.join(', ') : 'Not specified'}</p>
          <p><strong>Experience:</strong> ${experience}+ years</p>
          ${details.consultation_fee_inr ? `<p><strong>Fee:</strong> ₹${details.consultation_fee_inr}</p>` : ''}
        </div>
        ${details.about ? `<p class="lawyer-description">"${details.about.substring(0, 100)}${details.about.length > 100 ? '...' : ''}"</p>` : ''}
        <div class="lawyer-actions">
          <button class="btn btn-secondary" onclick="viewLawyerProfile('${lawyer.id}')">View Profile</button>
          <button class="btn btn-primary" onclick="contactLawyer('${lawyer.id}')">Contact</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterLawyers() {
  const city = document.getElementById('filterCity').value;
  const practice = document.getElementById('filterPracticeArea').value;
  const name = document.getElementById('nameFilter').value.toLowerCase();

  filteredLawyers = allLawyers.filter(lawyer => {
    const details = lawyer.lawyer_details || {};
    const cityMatch = !city || lawyer.city === city;
    const practiceMatch = !practice || (details.practice_areas && details.practice_areas.includes(practice));
    const nameMatch = !name || (lawyer.full_name && lawyer.full_name.toLowerCase().includes(name));
    return cityMatch && practiceMatch && nameMatch;
  });

  renderLawyers();
}

function viewLawyerProfile(lawyerId) {
  const lawyer = allLawyers.find(l => l.id === lawyerId);
  if (!lawyer) return;

  const details = lawyer.lawyer_details || {};
  const modal = document.getElementById('lawyerModal');
  const content = document.getElementById('lawyerModalContent');

  content.innerHTML = `
    <div class="lawyer-profile-modal">
      <h2>${lawyer.full_name || 'Lawyer'}</h2>
      <p class="lawyer-location" style="font-size: 1.1rem; margin-bottom: 1.5rem;">📍 ${lawyer.city || 'India'}</p>

      ${details.bar_council_id ? `
        <div class="modal-section">
          <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Bar Council ID</h3>
          <p>${details.bar_council_id}</p>
        </div>
      ` : ''}

      ${details.practice_areas && details.practice_areas.length > 0 ? `
        <div class="modal-section">
          <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Practice Areas</h3>
          <p>${details.practice_areas.join(', ')}</p>
        </div>
      ` : ''}

      <div class="modal-section">
        <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Experience</h3>
        <p>${details.years_experience || 0}+ years of legal practice</p>
      </div>

      ${details.courts && details.courts.length > 0 ? `
        <div class="modal-section">
          <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Courts</h3>
          <p>${details.courts.join(', ')}</p>
        </div>
      ` : ''}

      ${details.about ? `
        <div class="modal-section">
          <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">About</h3>
          <p>${details.about}</p>
        </div>
      ` : ''}

      ${details.consultation_fee_inr ? `
        <div class="modal-section">
          <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Consultation Fee</h3>
          <p>₹${details.consultation_fee_inr} per session (${details.consultation_mode || 'online'})</p>
        </div>
      ` : ''}

      ${lawyer.phone ? `
        <div class="modal-section">
          <h3 style="color: var(--primary-color); margin-bottom: 0.75rem;">Contact</h3>
          <p><strong>Phone:</strong> ${lawyer.phone}</p>
        </div>
      ` : ''}

      <button class="btn btn-primary btn-block" onclick="contactLawyer('${lawyer.id}'); closeLawyerModal();">Contact Now</button>
    </div>
  `;

  modal.classList.add('active');
}

function closeLawyerModal() {
  document.getElementById('lawyerModal').classList.remove('active');
}

function contactLawyer(lawyerId) {
  if (!isAuthenticated) {
    alert('Please login to contact lawyers');
    window.location.href = 'index.html';
    return;
  }

  const lawyer = allLawyers.find(l => l.id === lawyerId);
  if (lawyer) {
    // In a real app, this would create a conversation or open chat
    alert(`Contact ${lawyer.full_name}\\n\\nYou can now start a conversation with this lawyer.\\n\\nThis would redirect to the chat interface.`);
    // Optionally redirect to chat or create conversation
    // window.location.href = 'chat.html';
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
// PROFILE SECTION - REAL DATA FROM SUPABASE
// ============================================

async function loadProfile() {
  if (!isAuthenticated || !currentProfile) {
    // Show guest message
    document.getElementById('profileDisplay').innerHTML = `
      <div class="profile-avatar-large">G</div>
      <h3>Guest User</h3>
      <p class="profile-type">Not Logged In</p>
      <p style="text-align: center; color: var(--text-light); margin-top: 1rem;">
        Please <a href="index.html" style="color: var(--primary-color);">login</a> to view and edit your profile.
      </p>
    `;

    // Disable form
    const form = document.getElementById('profileForm');
    if (form) {
      Array.from(form.elements).forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
          el.disabled = true;
        }
      });
    }
    return;
  }

  // Enable form
  const form = document.getElementById('profileForm');
  if (form) {
    Array.from(form.elements).forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        el.disabled = false;
      }
    });
  }

  // Populate form with current profile data
  document.getElementById('profileName').value = currentProfile.full_name || '';
  document.getElementById('profileEmail').value = currentUser.email || '';
  document.getElementById('profileCity').value = currentProfile.city || '';
  document.getElementById('profileType').value = currentProfile.role || 'Client';
  document.getElementById('profileBio').value = currentProfile.description || '';

  const languages = currentProfile.languages || [];
  document.getElementById('profileInterests').value = languages.join(', ');

  // Update display
  updateProfileDisplay();
}

function updateProfileDisplay() {
  if (!currentProfile) return;

  const name = currentProfile.full_name || 'User';
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2) || 'U';

  document.getElementById('profileAvatarLarge').textContent = initials;
  document.getElementById('displayName').textContent = name;
  document.getElementById('displayType').textContent = currentProfile.role === 'client' ? 'Client' : 'Lawyer';
  document.getElementById('displayEmail').textContent = currentUser?.email || 'Not set';
  document.getElementById('displayCity').textContent = currentProfile.city || 'Not set';
  document.getElementById('displayBio').textContent = currentProfile.description || 'Not set';

  const languages = currentProfile.languages || [];
  document.getElementById('displayInterests').textContent = languages.length > 0 ? languages.join(', ') : 'Not set';
}

// Profile form submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to update your profile');
      window.location.href = 'index.html';
      return;
    }

    try {
      const languages = document.getElementById('profileInterests').value
        .split(',')
        .map(l => l.trim())
        .filter(l => l);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: document.getElementById('profileName').value,
          city: document.getElementById('profileCity').value,
          description: document.getElementById('profileBio').value,
          languages: languages
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Reload profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      currentProfile = updatedProfile;
      updateProfileDisplay();

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile: ' + error.message);
    }
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

    // In a real app, this would send to a server or Supabase
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

document.addEventListener('DOMContentLoaded', async () => {
  // Set current year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Check authentication first
  await checkAuthentication();

  // Load initial content
  loadNewsPreview();
  await loadLawyers();
  renderNews();
  await loadProfile();

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
