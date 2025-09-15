// =============================================================================
// STUCON FRONTEND SESSION MANAGEMENT 
// =============================================================================

/**
 * Set cookie with proper formatting and path
 */
function setCookie(name, value, hours = 24) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    // Set with path=/ for consistency across all pages
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    console.log(`🍪 Cookie set: ${name}=${value} (expires in ${hours}h)`);
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
 * Delete cookie with proper path clearing
 */
function deleteCookie(name) {
    // Delete with multiple path variations to ensure complete removal
    document.cookie = `${name}=; max-age=0; path=/`;
    document.cookie = `${name}=; max-age=0; path=/src`;
    document.cookie = `${name}=; max-age=0; path=/src/pages`;
    document.cookie = `${name}=; max-age=0`;
    console.log(`🗑️ Cookie deleted: ${name} (all paths cleared)`);
}

/**
 * Generate random session token
 */
function generateSessionToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'stucon_' + token + '_' + Date.now();
}

/**
 * Check if user has valid stucon session
 */
function isUserLoggedIn() {
    const sessionToken = getCookie('stucon_session');
    const userEmail = getCookie('stucon_userEmail');
    
    console.log('🔍 Session check:', {
        sessionToken: sessionToken ? '✅ Present' : '❌ Missing',
        userEmail: userEmail ? '✅ Present' : '❌ Missing'
    });
    
    return sessionToken && userEmail;
}

/**
 * Get logged-in user info
 */
function getLoggedInUser() {
    if (!isUserLoggedIn()) {
        return null;
    }
    
    const email = getCookie('stucon_userEmail');
    const username = email.split('@')[0]; // Extract name before @
    
    return {
        email: email,
        username: username
    };
}

/**
 * Store login session (called after successful login)
 */
function storeLoginSession(email) {
    const sessionToken = generateSessionToken();
    
    // Store both cookies for 24 hours
    setCookie('stucon_session', sessionToken, 24);
    setCookie('stucon_userEmail', email, 24);
    
    console.log('✅ Login session stored for:', email);
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
    //alert(message);
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
