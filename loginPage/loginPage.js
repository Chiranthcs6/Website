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
            // Updated API call to match backend specification
            const apiResponse = await fetch('/api/user/login', {
                method: 'PUT',  // Changed to PUT as per API spec
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email_string,
                    passwordHash: pwd_string  // Changed to passwordhash as per API spec
                })
            });

            if (!apiResponse.ok) {
                throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
            }

            const responseData = await apiResponse.json();
            
            if (responseData.valid) {
                localStorage.setItem('token', responseData.token);  // Changed to 'token' from API response
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
