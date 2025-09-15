// =============================================================================
// LOGIN PAGE - STUCON SESSION MANAGEMENT
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Stucon Login page loaded');
    
    // Check if already logged in using stucon session
    if (isUserLoggedIn()) {
        console.log('✅ User already logged in, redirecting to main page...');
        window.location.href = '/src/pages/main/mainPage.html';
        return;
    }

    // Initialize form elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    if (!loginForm || !emailInput || !passwordInput || !loginBtn) {
        console.error('❌ Required form elements not found');
        return;
    }

    // Handle form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            //alert('Please fill out all fields.');
            return;
        }

        if (password.length < 6) {
            //alert('Password must be at least 6 characters long.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            //alert('Please enter a valid email address.');
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
        `;

        try {
            // Try backend login first
            console.log('📤 Attempting backend login for:', email);
            const apiResponse = await fetch('/api/user/login', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    "email": email, 
                    "password": password 
                })
            });

            if (apiResponse.ok) {
                const responseData = await apiResponse.json();
                console.log('📥 Backend response:', responseData);
                
                if (responseData.valid && responseData.token) {
                    // Backend login successful - store stucon session
                    console.log('🍪 Storing backend session...');
                    storeLoginSession(email);
                    
                    console.log('✅ Backend login successful');
                    
                    // Wait to ensure cookies are set
                    setTimeout(() => {
                        //alert('Login successful! Welcome to Stucon.');
                        window.location.href = '/src/pages/main/mainPage.html';
                    }, 300);
                    return;
                }
            }
            
            throw new Error('Backend login failed or invalid response');
            
        } catch (error) {
            console.log('⚠️ Backend unavailable, using frontend-only login:', error.message);
            
            // Frontend-only fallback (for demo purposes)
            console.log('🍪 Storing frontend session...');
            
            // Store stucon session cookies
            storeLoginSession(email);
            
            console.log('✅ Frontend-only login successful');
            
            // Wait to ensure cookies are set
            setTimeout(() => {
                //alert('Login successful! Welcome to Stucon.\n(Demo Mode - Backend Unavailable)');
                window.location.href = '/src/pages/main/mainPage.html';
            }, 300);
            
        } finally {
            // Restore button state
            loginBtn.disabled = false;
            loginBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
                </svg>
                Sign In
            `;
        }
    });

    // Enter key support
    emailInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    console.log('✅ Login form initialized with stucon session management');
});
