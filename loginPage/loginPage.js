document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 SJC Grove Login page loaded');

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = 'Verifying...';

        try {
            // ============================================================
            // 📤 REQUEST: Send login data to backend server
            // ============================================================
            const apiResponse = await fetch('/api/login', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,        // 📧 email string
                    passwordHash: password   // 🔐 plain password (no hashing)
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
            
            // Expected response format:
            // {
            //   valid: boolean,        // ✅ true/false
            //   error: string,         // ❌ error message if valid=false
            //   session_token: string  // 🎫 session token if valid=true
            // }
            // ============================================================

            if (responseData.valid) {
                // Store session data and redirect
                localStorage.setItem('session_token', responseData.session_token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);

                alert('Login successful! Welcome to SJC Grove.');
                window.location.href = '../mainPage.html';
            } else {
                alert('Login failed: ' + (responseData.error || 'Invalid credentials'));
            }

        } catch (error) {
            console.error('API Login error:', error);
            alert('Login failed. Please check your connection and try again.');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
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

    console.log('✅ Login form initialized');
});
