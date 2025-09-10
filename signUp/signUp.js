document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 SJC Grove Signup page loaded');

    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signupBtn = document.getElementById('signup-btn');

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';

        try {
            // Send credentials directly (no hashing)
            const apiResponse = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password  // Changed from pwdhash to password
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

                alert('Account created successfully! Welcome to SJC Grove.');
                window.location.href = '../mainPage.html';
            } else {
                alert('Signup failed: ' + (responseData.error || 'Account creation failed'));
            }

        } catch (error) {
            console.error('API Signup error:', error);
            alert('Signup failed. Please check your connection and try again.');
        } finally {
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
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
            signupForm.dispatchEvent(new Event('submit'));
        }
    });

    console.log('✅ Signup form initialized');
});
