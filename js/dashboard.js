/**
 * Dashboard Logic
 * Handles role-based dashboard functionality
 */

import { supabase } from './supabaseClient.js';
import {
  formatDate,
  formatSimpleDate,
  formatRelativeTime,
  parseCommaSeparated,
  joinWithCommas,
  showError,
  showSuccess,
  clearMessages,
  formatCurrency,
  switchSection,
  createEmptyState
} from './utils.js';

let currentUser = null;
let currentProfile = null;
let lawyerDetails = null;

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthAndLoadDashboard();
});

/**
 * Check authentication and load dashboard
 */
async function checkAuthAndLoadDashboard() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = 'index.html';
      return;
    }

    currentUser = user;

    // Load profile
    await loadProfile();

    // Setup dashboard based on role
    if (currentProfile.role === 'client') {
      setupClientDashboard();
    } else if (currentProfile.role === 'lawyer') {
      setupLawyerDashboard();
    }

  } catch (error) {
    console.error('Dashboard initialization error:', error);
    alert('Failed to load dashboard. Please try logging in again.');
    window.location.href = 'index.html';
  }
}

/**
 * Load user profile from database
 */
async function loadProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (error) throw error;

  currentProfile = data;

  // Update welcome text
  const welcomeUser = document.getElementById('welcomeUser');
  if (welcomeUser) {
    welcomeUser.textContent = `Welcome, ${currentProfile.full_name}`;
  }

  // If lawyer, also load lawyer details
  if (currentProfile.role === 'lawyer') {
    const { data: lawyerData } = await supabase
      .from('lawyer_details')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    lawyerDetails = lawyerData;
  }

  // Populate profile form
  populateProfileForm();
}

/**
 * Populate profile form with user data
 */
function populateProfileForm() {
  document.getElementById('profileName').value = currentProfile.full_name || '';
  document.getElementById('profileCity').value = currentProfile.city || '';
  document.getElementById('profileState').value = currentProfile.state || '';
  document.getElementById('profilePhone').value = currentProfile.phone || '';
  document.getElementById('profileLanguages').value = joinWithCommas(currentProfile.languages) || '';
  document.getElementById('profileDescription').value = currentProfile.description || '';

  // If lawyer, populate lawyer profile form
  if (currentProfile.role === 'lawyer' && lawyerDetails) {
    document.getElementById('barCouncilId').value = lawyerDetails.bar_council_id || '';
    document.getElementById('yearsExperience').value = lawyerDetails.years_experience || 0;
    document.getElementById('practiceAreas').value = joinWithCommas(lawyerDetails.practice_areas) || '';
    document.getElementById('courts').value = joinWithCommas(lawyerDetails.courts) || '';
    document.getElementById('consultationMode').value = lawyerDetails.consultation_mode || 'online';
    document.getElementById('consultationFee').value = lawyerDetails.consultation_fee_inr || '';
    document.getElementById('about').value = lawyerDetails.about || '';
  }
}

/**
 * Setup client dashboard
 */
function setupClientDashboard() {
  const sidebar = document.querySelector('.sidebar-nav');
  sidebar.innerHTML = `
    <button data-section="profileSection" class="active" onclick="switchToSection('profileSection')">My Profile</button>
    <button data-section="findLawyersSection" onclick="switchToSection('findLawyersSection')">Find Lawyers</button>
    <button data-section="myChatsSection" onclick="switchToSection('myChatsSection')">My Chats</button>
  `;

  // Show client sections
  document.getElementById('profileSection').style.display = 'block';
  document.getElementById('profileSection').classList.add('active');
  document.getElementById('findLawyersSection').style.display = 'block';
  document.getElementById('myChatsSection').style.display = 'block';

  // Setup event listeners
  setupProfileForm();
  loadClientChats();

  // Load lawyers initially
  searchLawyers();
}

/**
 * Setup lawyer dashboard
 */
function setupLawyerDashboard() {
  const sidebar = document.querySelector('.sidebar-nav');
  sidebar.innerHTML = `
    <button data-section="profileSection" class="active" onclick="switchToSection('profileSection')">My Profile</button>
    <button data-section="lawyerProfileSection" onclick="switchToSection('lawyerProfileSection')">Lawyer Profile</button>
    <button data-section="myCasesSection" onclick="switchToSection('myCasesSection')">My Cases</button>
    <button data-section="clientChatsSection" onclick="switchToSection('clientChatsSection')">Client Chats</button>
  `;

  // Show lawyer sections
  document.getElementById('profileSection').style.display = 'block';
  document.getElementById('profileSection').classList.add('active');
  document.getElementById('lawyerProfileSection').style.display = 'block';
  document.getElementById('myCasesSection').style.display = 'block';
  document.getElementById('clientChatsSection').style.display = 'block';

  // Setup event listeners
  setupProfileForm();
  setupLawyerProfileForm();
  setupCasesManagement();
  loadLawyerChats();
}

/**
 * Setup profile form event listener
 */
function setupProfileForm() {
  const form = document.getElementById('profileForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorDiv = document.getElementById('profileError');
    const successDiv = document.getElementById('profileSuccess');
    clearMessages(errorDiv, successDiv);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: document.getElementById('profileName').value,
          city: document.getElementById('profileCity').value,
          state: document.getElementById('profileState').value,
          phone: document.getElementById('profilePhone').value,
          languages: parseCommaSeparated(document.getElementById('profileLanguages').value),
          description: document.getElementById('profileDescription').value,
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      showSuccess(successDiv, 'Profile updated successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      showError(errorDiv, error.message || 'Failed to update profile');
    }
  });
}

/**
 * Setup lawyer profile form event listener
 */
function setupLawyerProfileForm() {
  const form = document.getElementById('lawyerProfileForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorDiv = document.getElementById('lawyerProfileError');
    const successDiv = document.getElementById('lawyerProfileSuccess');
    clearMessages(errorDiv, successDiv);

    try {
      const { error } = await supabase
        .from('lawyer_details')
        .update({
          bar_council_id: document.getElementById('barCouncilId').value,
          years_experience: parseInt(document.getElementById('yearsExperience').value) || 0,
          practice_areas: parseCommaSeparated(document.getElementById('practiceAreas').value),
          courts: parseCommaSeparated(document.getElementById('courts').value),
          consultation_mode: document.getElementById('consultationMode').value,
          consultation_fee_inr: parseInt(document.getElementById('consultationFee').value) || null,
          about: document.getElementById('about').value,
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      showSuccess(successDiv, 'Lawyer profile updated successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Lawyer profile update error:', error);
      showError(errorDiv, error.message || 'Failed to update lawyer profile');
    }
  });
}

/**
 * Search and display lawyers
 */
window.searchLawyers = async function() {
  const grid = document.getElementById('lawyersGrid');
  grid.innerHTML = '<div class="loading">Loading lawyers...</div>';

  const city = document.getElementById('filterCity').value;
  const practiceArea = document.getElementById('filterPracticeArea').value;
  const experience = document.getElementById('filterExperience').value;

  try {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        lawyer_details (*)
      `)
      .eq('role', 'lawyer');

    // Apply filters
    if (city) {
      query = query.eq('city', city);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Filter by practice area and experience (client-side)
    let filteredData = data;

    if (practiceArea) {
      filteredData = filteredData.filter(lawyer =>
        lawyer.lawyer_details &&
        lawyer.lawyer_details.practice_areas &&
        lawyer.lawyer_details.practice_areas.includes(practiceArea)
      );
    }

    if (experience) {
      filteredData = filteredData.filter(lawyer => {
        if (!lawyer.lawyer_details) return false;
        const exp = lawyer.lawyer_details.years_experience || 0;
        if (experience === '0-5') return exp >= 0 && exp < 5;
        if (experience === '5-10') return exp >= 5 && exp < 10;
        if (experience === '10+') return exp >= 10;
        return true;
      });
    }

    // Display lawyers
    if (filteredData.length === 0) {
      grid.appendChild(createEmptyState('No lawyers found matching your criteria'));
      return;
    }

    grid.innerHTML = '';
    filteredData.forEach(lawyer => {
      grid.appendChild(createLawyerCard(lawyer));
    });

  } catch (error) {
    console.error('Search error:', error);
    grid.innerHTML = '<div class="empty-state"><h3>Failed to load lawyers</h3></div>';
  }
};

/**
 * Create lawyer card element
 */
function createLawyerCard(lawyer) {
  const card = document.createElement('div');
  card.className = 'lawyer-card';

  const details = lawyer.lawyer_details || {};

  card.innerHTML = `
    <h3>${lawyer.full_name}</h3>
    <div class="lawyer-info">
      <p><strong>City:</strong> ${lawyer.city || 'Not specified'}</p>
      <p><strong>Practice Areas:</strong> ${joinWithCommas(details.practice_areas) || 'Not specified'}</p>
      <p><strong>Experience:</strong> ${details.years_experience || 0} years</p>
      <p><strong>Fee:</strong> ${formatCurrency(details.consultation_fee_inr)}</p>
    </div>
    <div class="lawyer-card-actions">
      <button class="btn btn-secondary" onclick="viewLawyerProfile('${lawyer.id}')">View Profile</button>
      <button class="btn btn-primary" onclick="startChat('${lawyer.id}')">Chat Now</button>
    </div>
  `;

  return card;
}

/**
 * View lawyer profile in modal
 */
window.viewLawyerProfile = async function(lawyerId) {
  const modal = document.getElementById('lawyerModal');
  const content = document.getElementById('lawyerModalContent');

  content.innerHTML = '<div class="loading">Loading...</div>';
  modal.classList.add('active');

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        lawyer_details (*)
      `)
      .eq('id', lawyerId)
      .single();

    if (error) throw error;

    const details = data.lawyer_details || {};

    // Load cases
    const { data: cases } = await supabase
      .from('cases')
      .select('*')
      .eq('lawyer_id', lawyerId)
      .order('created_at', { ascending: false })
      .limit(5);

    content.innerHTML = `
      <div class="lawyer-detail-section">
        <h2>${data.full_name}</h2>
        <p><strong>Bar Council ID:</strong> ${details.bar_council_id || 'N/A'}</p>
      </div>

      <div class="lawyer-detail-section">
        <h3>Practice Information</h3>
        <p><strong>City:</strong> ${data.city || 'Not specified'}</p>
        <p><strong>State:</strong> ${data.state || 'Not specified'}</p>
        <p><strong>Experience:</strong> ${details.years_experience || 0} years</p>
        <p><strong>Practice Areas:</strong><br>
          ${(details.practice_areas || []).map(area => `<span class="badge">${area}</span>`).join('') || 'Not specified'}
        </p>
        <p><strong>Courts:</strong><br>
          ${(details.courts || []).map(court => `<span class="badge">${court}</span>`).join('') || 'Not specified'}
        </p>
        <p><strong>Languages:</strong> ${joinWithCommas(data.languages) || 'Not specified'}</p>
      </div>

      <div class="lawyer-detail-section">
        <h3>Consultation</h3>
        <p><strong>Mode:</strong> ${details.consultation_mode || 'Online'}</p>
        <p><strong>Fee:</strong> ${formatCurrency(details.consultation_fee_inr)} per session</p>
      </div>

      <div class="lawyer-detail-section">
        <h3>About</h3>
        <p>${details.about || 'No information provided'}</p>
      </div>

      ${cases && cases.length > 0 ? `
        <div class="lawyer-detail-section">
          <h3>Recent Cases</h3>
          ${cases.map(c => `
            <div class="case-card" style="margin-bottom: 1rem;">
              <h4>${c.title}</h4>
              <p><strong>Type:</strong> ${c.case_type || 'N/A'} | <strong>Court:</strong> ${c.court || 'N/A'}</p>
              <p><strong>Status:</strong> <span class="case-status ${c.status}">${c.status}</span></p>
              <p>${c.summary || ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <button class="btn btn-primary btn-block" onclick="startChat('${lawyerId}'); closeLawyerModal();">Start Chat</button>
    `;

  } catch (error) {
    console.error('Error loading lawyer profile:', error);
    content.innerHTML = '<div class="empty-state"><h3>Failed to load profile</h3></div>';
  }
};

/**
 * Close lawyer modal
 */
window.closeLawyerModal = function() {
  document.getElementById('lawyerModal').classList.remove('active');
};

/**
 * Start chat with lawyer
 */
window.startChat = async function(lawyerId) {
  try {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('client_id', currentUser.id)
      .eq('lawyer_id', lawyerId)
      .single();

    if (existing) {
      window.location.href = `chat.html?conversation_id=${existing.id}`;
      return;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        client_id: currentUser.id,
        lawyer_id: lawyerId,
      }])
      .select()
      .single();

    if (error) throw error;

    window.location.href = `chat.html?conversation_id=${data.id}`;

  } catch (error) {
    console.error('Error starting chat:', error);
    alert('Failed to start chat. Please try again.');
  }
};

/**
 * Setup cases management for lawyers
 */
function setupCasesManagement() {
  const form = document.getElementById('addCaseForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('cases')
        .insert([{
          lawyer_id: currentUser.id,
          title: document.getElementById('caseTitle').value,
          case_type: document.getElementById('caseType').value,
          court: document.getElementById('caseCourt').value,
          start_date: document.getElementById('caseStartDate').value || null,
          summary: document.getElementById('caseSummary').value,
          status: 'ongoing',
        }]);

      if (error) throw error;

      form.reset();
      loadCases();
      alert('Case added successfully!');
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Failed to add case. Please try again.');
    }
  });

  loadCases();
}

/**
 * Load lawyer's cases
 */
async function loadCases() {
  const list = document.getElementById('casesList');
  list.innerHTML = '<div class="loading">Loading cases...</div>';

  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('lawyer_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data.length === 0) {
      list.appendChild(createEmptyState('No cases yet. Add your first case above!'));
      return;
    }

    list.innerHTML = '';
    data.forEach(caseItem => {
      list.appendChild(createCaseCard(caseItem));
    });

  } catch (error) {
    console.error('Error loading cases:', error);
    list.innerHTML = '<div class="empty-state"><h3>Failed to load cases</h3></div>';
  }
}

/**
 * Create case card element
 */
function createCaseCard(caseItem) {
  const card = document.createElement('div');
  card.className = 'case-card';

  card.innerHTML = `
    <div class="case-header">
      <div>
        <h3>${caseItem.title}</h3>
        <p class="text-muted">${caseItem.case_type || 'N/A'} | ${caseItem.court || 'N/A'}</p>
      </div>
      <span class="case-status ${caseItem.status}">${caseItem.status}</span>
    </div>
    <div class="case-details">
      <p><strong>Start Date:</strong> ${formatSimpleDate(caseItem.start_date)}</p>
      ${caseItem.end_date ? `<p><strong>End Date:</strong> ${formatSimpleDate(caseItem.end_date)}</p>` : ''}
      <p>${caseItem.summary || ''}</p>
    </div>
    <div class="case-actions">
      ${caseItem.status === 'ongoing' ? `
        <button class="btn btn-secondary" onclick="markCaseClosed('${caseItem.id}')">Mark as Closed</button>
      ` : ''}
      <button class="btn btn-secondary" onclick="deleteCase('${caseItem.id}')">Delete</button>
    </div>
  `;

  return card;
}

/**
 * Mark case as closed
 */
window.markCaseClosed = async function(caseId) {
  try {
    const { error } = await supabase
      .from('cases')
      .update({
        status: 'closed',
        end_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', caseId);

    if (error) throw error;

    loadCases();
  } catch (error) {
    console.error('Error closing case:', error);
    alert('Failed to close case.');
  }
};

/**
 * Delete case
 */
window.deleteCase = async function(caseId) {
  if (!confirm('Are you sure you want to delete this case?')) return;

  try {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId);

    if (error) throw error;

    loadCases();
  } catch (error) {
    console.error('Error deleting case:', error);
    alert('Failed to delete case.');
  }
};

/**
 * Load client's chats
 */
async function loadClientChats() {
  const list = document.getElementById('clientChatsList');
  list.innerHTML = '<div class="loading">Loading conversations...</div>';

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        lawyer:lawyer_id (
          full_name
        )
      `)
      .eq('client_id', currentUser.id)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) throw error;

    if (data.length === 0) {
      list.appendChild(createEmptyState('No conversations yet. Find a lawyer and start chatting!'));
      return;
    }

    list.innerHTML = '';
    for (const conv of data) {
      list.appendChild(await createChatItem(conv, 'client'));
    }

  } catch (error) {
    console.error('Error loading chats:', error);
    list.innerHTML = '<div class="empty-state"><h3>Failed to load conversations</h3></div>';
  }
}

/**
 * Load lawyer's chats
 */
async function loadLawyerChats() {
  const list = document.getElementById('lawyerChatsList');
  list.innerHTML = '<div class="loading">Loading conversations...</div>';

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        client:client_id (
          full_name
        )
      `)
      .eq('lawyer_id', currentUser.id)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) throw error;

    if (data.length === 0) {
      list.appendChild(createEmptyState('No conversations yet. Clients will reach out to you!'));
      return;
    }

    list.innerHTML = '';
    for (const conv of data) {
      list.appendChild(await createChatItem(conv, 'lawyer'));
    }

  } catch (error) {
    console.error('Error loading chats:', error);
    list.innerHTML = '<div class="empty-state"><h3>Failed to load conversations</h3></div>';
  }
}

/**
 * Create chat item element
 */
async function createChatItem(conversation, userRole) {
  const item = document.createElement('div');
  item.className = 'chat-item';
  item.onclick = () => window.location.href = `chat.html?conversation_id=${conversation.id}`;

  // Get last message
  const { data: lastMessage } = await supabase
    .from('messages')
    .select('body, created_at')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const otherPartyName = userRole === 'client'
    ? conversation.lawyer?.full_name || 'Lawyer'
    : conversation.client?.full_name || 'Client';

  item.innerHTML = `
    <h4>${otherPartyName}</h4>
    <p class="chat-preview">${lastMessage?.body || 'No messages yet'}</p>
    <p class="chat-time">${formatRelativeTime(lastMessage?.created_at || conversation.created_at)}</p>
  `;

  return item;
}

/**
 * Switch to a section
 */
window.switchToSection = function(sectionId) {
  switchSection(sectionId);
};

// Make handleLogout available globally
window.handleLogout = async function() {
  try {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to logout.');
  }
};
