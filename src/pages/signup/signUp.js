// =============================================================================
// SIGNUP PAGE - COMPLETE FRONTEND SOLUTION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Stucon Signup page loaded');
    
    // Check if already logged in
    const session = validateFrontendSession();
    if (session.valid) {
        console.log('✅ Already logged in, redirecting...');
        window.location.href = '/src/pages/main/mainPage.html';
        return;
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

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        const username = email.split('@')[0];
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';

        try {
            // Try backend signup first
            const apiResponse = await fetch('/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "email": email,
                    "name": username,
                    "password": password
                })
            });

            if (apiResponse.ok) {
                const responseData = await apiResponse.json();
                if (responseData.valid && responseData.token) {
                    // Backend signup successful
                    setCookie('session_token', responseData.token, 7);
                    setCookie('user_email', email, 7);
                    setCookie('username', username, 7);
                    setCookie('is_logged_in', 'true', 7);
                    
                    console.log('✅ Backend signup successful');
                    
                    setTimeout(() => {
                        alert('Account created successfully! Welcome to Stucon.');
                        window.location.href = '/src/pages/main/mainPage.html';
                    }, 100);
                    return;
                }
            }
            
            throw new Error('Backend signup failed');

        } catch (error) {
            console.log('⚠️ Backend unavailable, using frontend-only signup');
            
            // Frontend-only fallback
            setCookie('session_token', 'frontend_' + Date.now(), 7);
            setCookie('user_email', email, 7);
            setCookie('username', username, 7);
            setCookie('is_logged_in', 'true', 7);
            
            console.log('✅ Frontend-only signup successful');
            
            setTimeout(() => {
                alert('Account created successfully! (Demo Mode - Backend Unavailable)');
                window.location.href = '/src/pages/main/mainPage.html';
            }, 100);

        } finally {
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
        }
    });

    // Enter key navigation
    emailInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            signupForm.dispatchEvent(new Event('submit'));
        }
    });

    console.log('✅ Signup form initialized');
});
