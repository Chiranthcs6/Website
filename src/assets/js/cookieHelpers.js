/* =============================================================================
   STUCON FRONTEND SESSION MANAGEMENT
   ============================================================================= */

/**
 * Set cookie with options
 * hours: lifetime in hours (default 24)
 * sameSite: 'Lax' | 'Strict' | 'None' (default 'Lax')
 * secure: boolean (default false; must be true if SameSite=None)
 * path: cookie path (default '/')
 */
function setCookie(name, value, hours = 24, { sameSite = 'Lax', secure = false, path = '/' } = {}) {
  const maxAge = Math.floor(hours * 60 * 60); // seconds
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}; Max-Age=${maxAge}; Path=${path}; SameSite=${sameSite}`;
  if (secure || sameSite === 'None') cookie += '; Secure';
  document.cookie = cookie;
  console.log(`🍪 Cookie set: ${name} (Max-Age=${maxAge}s, SameSite=${sameSite}${secure || sameSite === 'None' ? ', Secure' : ''})`);
}

/**
 * Get cookie value by name (robust parsing)
 */
function getCookie(name) {
  const target = encodeURIComponent(name) + '=';
  const list = document.cookie ? document.cookie.split(';') : [];
  for (let c of list) {
    c = c.trim();
    if (c.startsWith(target)) {
      const raw = c.substring(target.length);
      try {
        return decodeURIComponent(raw);
      } catch (e) {
        console.warn('⚠️ Cookie decode failed for', name, e);
        return raw;
      }
    }
  }
  return null;
}

/**
 * Delete cookie for common paths (client-side)
 */
function deleteCookie(name) {
  const base = `${encodeURIComponent(name)}=; Max-Age=0`;
  const paths = ['/', '/src', '/src/pages'];
  paths.forEach(p => (document.cookie = `${base}; Path=${p}`));
  // Also unset without explicit Path to cover default-path cookies
  document.cookie = `${base}`;
  console.log(`🗑️ Cookie deleted: ${name} (paths cleared)`);
}

/**
 * Generate random session token (client-only)
 */
function generateSessionToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
  return 'stucon_' + token + '_' + Date.now();
}

/**
 * Check if user has valid stucon session
 */
function isUserLoggedIn() {
  const sessionToken = getCookie('stucon_session');
  const userEmail = getCookie('stucon_userEmail');
  const valid = Boolean(sessionToken && userEmail);
  console.log('🔍 Session check:', {
    sessionToken: sessionToken ? '✅ Present' : '❌ Missing',
    userEmail: userEmail ? '✅ Present' : '❌ Missing'
  });
  return valid;
}

/**
 * Get logged-in user info
 */
function getLoggedInUser() {
  if (!isUserLoggedIn()) return null;
  const email = getCookie('stucon_userEmail');
  const username = email ? email.split('@') : '';
  return { email, username };
}

/**
 * Store login session (called after successful login/signup)
 * Option 1: pass 1 hour when calling this (not hardcoded)
 */
function storeLoginSession(email, hours = 24) {
  const sessionToken = generateSessionToken();
  setCookie('stucon_session', sessionToken, hours);
  setCookie('stucon_userEmail', email, hours);
  console.log('✅ Login session stored for:', email, `(expires in ${hours}h)`);
  return sessionToken;
}

/**
 * Clear login session (logout)
 */
function clearLoginSession() {
  deleteCookie('stucon_session');
  deleteCookie('stucon_userEmail');
  console.log('🧹 Login session cleared');
}

/**
 * Redirect to login page
 */
function redirectToLogin(message = 'Please log in to access this page.') {
  console.log('🔒 Redirecting to login page:', message);
  window.location.href = '/src/pages/login/loginPage.html';
}

/**
 * Validate page access (call at start of protected pages)
 */
function validatePageAccess() {
  console.log('🛡️ Validating page access...');
  if (!isUserLoggedIn()) {
    console.log('❌ Access denied - user not logged in');
    redirectToLogin('You must be logged in to access this page.');
    return false;
  }
  const user = getLoggedInUser();
  console.log('✅ Access granted for:', user.username);
  return user;
}

console.log('✅ Stucon cookie helpers loaded - Session management ready');
