document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Stucon Signup page loaded');
    
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signupBtn = document.getElementById('signup-btn');

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

        // Extract username from email (part before @)
        const username = email.split('@')[0];

        signupBtn.disabled = false;
        signupBtn.textContent = 'Creating Account...';

        try {
            // 📤 REQUEST: Send signup data to backend
            const apiResponse = await fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "name": username,
                    "password": password  // ✅ Plain password (no hashing)
                })
            });

            if (!apiResponse.ok) {
                throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
            }

            // 📥 RECEIVE: Get response from backend
            const responseData = await apiResponse.json();
            
            // Check response structure: {valid: boolean, token: string}
            if (responseData.valid) {
                // Store authentication data
            document.cookie = `session_token=${responseData.token}; path=/;`;
            document.cookie = `isLoggedIn=${true}; path=/;`;
            document.cookie = `userEmail=${email}; path=/;`;

                
                
                
                // Redirect to main page
                window.location.href = '../src/pages/main/mainPage.html';
            } else {
                alert('Signup failed: ' + (responseData.error || 'Account creation failed'));
            }

        } catch (error) {
            console.error('API Signup error:', error);
            alert('Signup failed. Please check your connection and try again.');
        } finally {
            // Re-enable the button
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
