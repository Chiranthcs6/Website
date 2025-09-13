document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Stucon Login page loaded');

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    // =============================================================================
    // COOKIE UTILITY FUNCTIONS
    // =============================================================================
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, val] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(val);
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; max-age=0; path=/; Secure; SameSite=Strict`;
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
        `;

        try {
            // ============================================================
            // 📤 REQUEST: Send login data to backend server
            // ============================================================
            const apiResponse = await fetch('/api/user/login', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important for cookie-based auth
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            // ============================================================

            if (!apiResponse.ok) {
                throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
            }

            // ============================================================
            // 📥 RECEIVE: Get response data from backend server
            // ============================================================
            const responseData = await apiResponse.json();
            
            if (responseData.valid) {
                // 🍪 STORE IN COOKIES: Save user session data
                setCookie('session_token', responseData.session_token, 7); // 7 days
                setCookie('user_email', email, 7); // 7 days
                setCookie('is_logged_in', 'true', 7); // 7 days
                
                console.log('✅ Login successful, cookies set');
                alert('Login successful! Welcome to Stucon.');
                
                // Redirect to main page
                window.location.href = '../src/pages/main/mainPage.html';
            } else {
                alert('Login failed: ' + (responseData.error || 'Invalid credentials'));
            }

        } catch (error) {
            console.error('API Login error:', error);
            alert('Login failed. Please check your connection and try again.');
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = `
                <span class="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </span>
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

    console.log('✅ Login form initialized with cookie support');
});
