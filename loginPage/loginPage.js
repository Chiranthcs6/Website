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
            // Send credentials directly (no client-side hashing)
            const apiResponse = await fetch('/api/login', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password  // Plain text password
                })
            });

            if (!apiResponse.ok) {
                throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
            }

            const responseData = await apiResponse.json();
            
            if (responseData.valid) {
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
