// =============================================================================
// FRONTEND SESSION MANAGEMENT - NO AUTO-REDIRECTS
// =============================================================================

/**
 * Set cookie with proper formatting
 */
function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    console.log(`🍪 Cookie set: ${name}=${value}`);
}

/**
 * Get cookie value
 */
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    
    for (const cookie of cookies) {
        const [key, val] = cookie.split('=');
        if (key === name && val) {
            return decodeURIComponent(val);
        }
    }
    return null;
}

/**
 * Delete cookie
 */
function deleteCookie(name) {
    document.cookie = `${name}=; max-age=0; path=/`;
    console.log(`🗑️ Cookie deleted: ${name}`);
}

/**
 * Clear all session cookies
 */
function clearSessionCookies() {
    deleteCookie('session_token');
    deleteCookie('user_email');
    deleteCookie('username');
    deleteCookie('is_logged_in');
    console.log('🧹 All session cookies cleared');
}

/**
 * Manual redirect to login - ONLY WHEN USER CLICKS SOMETHING
 */
function redirectToLogin(message = 'Please log in to access this page.') {
    console.log('🔒 Manual redirect to login:', message);
    clearSessionCookies();
    alert(message);
    window.location.href = '/src/pages/login/loginPage.html';
}

/**
 * Get user from cookies - NO VALIDATION, NO REDIRECTS
 */
function getUserFromCookies() {
    const email = getCookie('user_email');
    const username = getCookie('username');
    
    if (email) {
        return {
            email: email,
            username: username || email.split('@')[0]
        };
    }
    
    return null;
}

console.log('✅ Cookie helpers loaded - No automatic authentication checks');
