/* =============================================================================
   SIGNUP PAGE - STUCON 
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  console.log('📝 Stucon Signup page loaded');

  // If already logged in, redirect to main page (optional short-circuit)
  function validateLocalSession() {
    const token = getCookie && getCookie('stucon_session');
    const email = getCookie && getCookie('stucon_userEmail');
    const valid = Boolean(token && email);
    return { valid, email };
  }
  try {
    const session = validateLocalSession();
    if (session.valid) {
      console.log('✅ Already logged in, redirecting...');
      window.location.href = '/src/pages/main/mainPage.html';
      return;
    }
  } catch (_) {
    // If cookie helpers not loaded here, skip this shortcut
  }

  // Initialize form elements
  const signupForm = document.getElementById('signup-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signupBtn = document.getElementById('signup-btn');

  if (!signupForm || !emailInput || !passwordInput || !signupBtn) {
    console.error('❌ Required form elements not found');
    return;
  }

  // Submit handler with status-aware branching
  signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    const username = email.split('@');
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';

    try {
      const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: username, password })
      });

      // Duplicate email case (preferred: backend returns 409 Conflict)
      if (res.status === 409) {
        alert('This email is already registered. Please log in instead.');
        return;
      }

      // Success case (201 Created or 200 OK)
      if (res.ok) {
        alert('Account created successfully! Please log in.');
        window.location.href = '/src/pages/login/loginPage.html';
        return;
      }

      // Other non-OK statuses
      console.warn('Signup failed:', res.status, res.statusText);
      alert('Signup failed. Please try again later.');
    } catch (err) {
      console.error('Signup network error:', err);
      alert('Network error. Please check your connection and try again.');
    } finally {
      signupBtn.disabled = false;
      signupBtn.textContent = 'Create Account';
    }
  });

  // Enter key navigation
  emailInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      signupForm.dispatchEvent(new Event('submit'));
    }
  });

  console.log('✅ Signup form initialized');
});
