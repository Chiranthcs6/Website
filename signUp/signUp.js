document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 SJC Grove Signup page with API integration loaded');

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
            // 🔢 STEP 1: Hash password with Argon2 (client-side)
            const hashResult = await argon2.hash({
                pass: password,
                salt: new TextEncoder().encode(email + 'saltsecret'), // Use email+secret as salt
                time: 1,
                mem: 1024,
                parallelism: 1,
                hashLen: 32,
                type: argon2.ArgonType.Argon2id
            });

            const pwdhash = hashResult.encoded;

            // 🔢 STEP 2: Send API request to backend
            const apiResponse = await fetch('/api/signup', { // ⚠️ TODO: Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,      // 📧 email string
                    pwdhash: pwdhash   // 🔐 pwdhash string
                })
            });

            if (!apiResponse.ok) {
                throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
            }

            // 🔢 STEP 3: Parse response from backend
            const responseData = await apiResponse.json();
            
            // Expected response format:
            // {
            //   valid: boolean,        // ✅ true/false
            //   error: string,         // ❌ error message if valid=false
            //   session_token: string  // 🎫 session token if valid=true
            // }

            if (responseData.valid) {
                // 🔢 STEP 4: Store session data and redirect
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

    console.log('✅ Signup with API integration initialized');
});
