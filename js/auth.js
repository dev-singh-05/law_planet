/**
 * Authentication Logic
 * Handles signup, login, logout, and auth state
 */

import { supabase } from './supabaseClient.js';

// Check if user is already logged in and redirect to home
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    window.location.href = 'home.html';
  }
}

// Initialize auth checks on page load
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  checkAuth();
}

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    errorDiv.textContent = '';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to home
      window.location.href = 'home.html';
    } catch (error) {
      errorDiv.textContent = error.message || 'Failed to login. Please check your credentials.';
    }
  });
}

// Handle Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const city = document.getElementById('signupCity').value;
    const phone = document.getElementById('signupPhone').value;
    const role = window.getSelectedRole();
    const errorDiv = document.getElementById('signupError');

    errorDiv.textContent = '';

    if (!role) {
      errorDiv.textContent = 'Please select a role (Client or Lawyer)';
      return;
    }

    // Validate lawyer-specific fields
    if (role === 'lawyer') {
      const barCouncilId = document.getElementById('barCouncilId').value;
      const practiceArea = document.getElementById('practiceArea').value;

      if (!barCouncilId || !practiceArea) {
        errorDiv.textContent = 'Please fill in all lawyer-specific fields';
        return;
      }
    }

    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          full_name: fullName,
          role: role,
          city: city,
          phone: phone || null,
        }]);

      if (profileError) throw profileError;

      // If lawyer, create lawyer_details
      if (role === 'lawyer') {
        const barCouncilId = document.getElementById('barCouncilId').value;
        const practiceArea = document.getElementById('practiceArea').value;
        const yearsExperience = parseInt(document.getElementById('yearsExperience').value) || 0;

        const { error: lawyerError } = await supabase
          .from('lawyer_details')
          .insert([{
            id: userId,
            bar_council_id: barCouncilId,
            practice_areas: [practiceArea],
            years_experience: yearsExperience,
          }]);

        if (lawyerError) throw lawyerError;
      }

      // Redirect to home
      window.location.href = 'home.html';

    } catch (error) {
      console.error('Signup error:', error);
      errorDiv.textContent = error.message || 'Failed to sign up. Please try again.';
    }
  });
}

// Handle Logout (global function)
window.handleLogout = async function() {
  try {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to logout. Please try again.');
  }
};

// Export for use in other modules
export { supabase };
