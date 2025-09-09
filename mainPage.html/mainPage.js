document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 SJC Grove Main Page loaded');

    // Check if user is logged in
    checkUserAuthentication();
    
    // Initialize page components
    initializeUserInterface();
    initializeDropdowns();
    initializeMobileMenu();
    initializeLogout();

    // Load user preferences if any
    loadUserPreferences();
});

/**
 * Check if user is authenticated and redirect if not
 */
function checkUserAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    console.log('🔐 Checking authentication...', { isLoggedIn, userEmail, userName });

    // Redirect to login if not authenticated
    if (!isLoggedIn || isLoggedIn !== 'true') {
        alert('Please login first to access the main page.');
        window.location.href = 'loginPage/loginPage.html';
        return;
    }

    // Display user information
    const userNameElement = document.getElementById('user-name');
    if (userName && userNameElement) {
        userNameElement.textContent = `Welcome, ${userName}`;
    } else if (userEmail && userNameElement) {
        userNameElement.textContent = `Welcome, ${userEmail}`;
    }

    console.log('✅ User authenticated successfully');
}

/**
 * Initialize user interface components
 */
function initializeUserInterface() {
    // Add loading states
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Add smooth transitions
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialize dropdown functionality
 */
function initializeDropdowns() {
    const dropdowns = [
        { btn: 'scheme-btn', dropdown: 'scheme-dropdown', type: 'scheme' },
        { btn: 'branch-btn', dropdown: 'branch-dropdown', type: 'branch' },
        { btn: 'semester-btn', dropdown: 'semester-dropdown', type: 'semester' },
        { btn: 'subject-btn', dropdown: 'subject-dropdown', type: 'subject' }
    ];

    dropdowns.forEach(({ btn, dropdown, type }) => {
        const button = document.getElementById(btn);
        const dropdownMenu = document.getElementById(dropdown);
        const arrow = button.querySelector('svg');

        if (!button || !dropdownMenu) {
            console.error(`❌ Dropdown elements not found: ${btn}, ${dropdown}`);
            return;
        }

        // Toggle dropdown on button click
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            dropdowns.forEach(({ btn: otherBtn, dropdown: otherDropdown }) => {
                if (otherBtn !== btn) {
                    const otherDropdownEl = document.getElementById(otherDropdown);
                    const otherArrow = document.getElementById(otherBtn).querySelector('svg');
                    
                    if (otherDropdownEl) {
                        otherDropdownEl.classList.add('hidden');
                        otherArrow.classList.remove('rotate-180');
                    }
                }
            });

            // Toggle current dropdown
            const isHidden = dropdownMenu.classList.contains('hidden');
            
            if (isHidden) {
                dropdownMenu.classList.remove('hidden');
                arrow.classList.add('rotate-180');
                console.log(`📋 Opened ${type} dropdown`);
            } else {
                dropdownMenu.classList.add('hidden');
                arrow.classList.remove('rotate-180');
                console.log(`📋 Closed ${type} dropdown`);
            }
        });

        // Handle dropdown item selection
        dropdownMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                
                const selectedText = e.target.textContent;
                const selectedValue = e.target.getAttribute('data-value');
                
                // Update button text
                button.querySelector('span').textContent = selectedText;
                
                // Close dropdown
                dropdownMenu.classList.add('hidden');
                arrow.classList.remove('rotate-180');
                
                // Update selection display
                updateSelection(type, selectedText, selectedValue);
                
                // Load content based on selection
                loadContent();
                
                console.log(`✅ Selected ${type}: ${selectedText} (${selectedValue})`);
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(({ dropdown, btn }) => {
            const dropdownEl = document.getElementById(dropdown);
            const arrow = document.getElementById(btn).querySelector('svg');
            
            if (dropdownEl) {
                dropdownEl.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            }
        });
    });

    console.log('✅ Dropdowns initialized');
}

/**
 * Initialize mobile menu
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                console.log('📱 Mobile menu opened');
            } else {
                mobileMenu.classList.add('hidden');
                console.log('📱 Mobile menu closed');
            }
        });
    }
}

/**
 * Initialize logout functionality
 */
function initializeLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // Clear all user data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                localStorage.removeItem('session_token');
                localStorage.removeItem('selectedScheme');
                localStorage.removeItem('selectedBranch');
                localStorage.removeItem('selectedSemester');
                localStorage.removeItem('selectedSubject');
                
                console.log('🚪 User logged out successfully');
                
                // Redirect to login page
                alert('Logged out successfully');
                window.location.href = 'loginPage/loginPage.html';
            }
        });
    }
}

/**
 * Update selection display
 */
function updateSelection(type, text, value) {
    const selectionDisplay = document.getElementById('current-selection');
    const selectedElement = document.getElementById(`selected-${type}`);
    
    if (selectedElement) {
        selectedElement.textContent = text;
        
        // Save selection to localStorage
        localStorage.setItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify({
            text: text,
            value: value
        }));
        
        // Show selection display
        if (selectionDisplay) {
            selectionDisplay.classList.remove('hidden');
        }
    }
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
    const preferences = ['scheme', 'branch', 'semester', 'subject'];
    
    preferences.forEach(type => {
        const saved = localStorage.getItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`);
        
        if (saved) {
            try {
                const { text, value } = JSON.parse(saved);
                
                // Update button text
                const button = document.getElementById(`${type}-btn`);
                if (button) {
                    button.querySelector('span').textContent = text;
                }
                
                // Update selection display
                const selectedElement = document.getElementById(`selected-${type}`);
                if (selectedElement) {
                    selectedElement.textContent = text;
                }
                
                console.log(`📋 Restored ${type} preference: ${text}`);
            } catch (e) {
                console.error(`❌ Error loading ${type} preference:`, e);
            }
        }
    });
    
    // Show selection display if any preferences exist
    const hasAnySelection = preferences.some(type => 
        localStorage.getItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`)
    );
    
    if (hasAnySelection) {
        const selectionDisplay = document.getElementById('current-selection');
        if (selectionDisplay) {
            selectionDisplay.classList.remove('hidden');
        }
    }
}

/**
 * Load content based on current selections
 */
function loadContent() {
    const dynamicContent = document.getElementById('dynamic-content');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    if (!dynamicContent) return;
    
    // Get current selections
    const scheme = getStoredSelection('scheme');
    const branch = getStoredSelection('branch');
    const semester = getStoredSelection('semester');
    const subject = getStoredSelection('subject');
    
    // Show loading
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
    
    // Simulate content loading
    setTimeout(() => {
        let content = '';
        
        if (scheme && branch && semester && subject) {
            // All selections made - show specific content
            content = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-green-800 mb-4">📚 Academic Content Available</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-white rounded-lg p-4">
                            <h4 class="font-medium text-gray-800 mb-2">📄 Course Materials</h4>
                            <ul class="text-sm text-gray-600 space-y-1">
                                <li>• Lecture Notes</li>
                                <li>• Lab Manuals</li>
                                <li>• Previous Year Papers</li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-lg p-4">
                            <h4 class="font-medium text-gray-800 mb-2">🎯 Assignments</h4>
                            <ul class="text-sm text-gray-600 space-y-1">
                                <li>• Weekly Assignments</li>
                                <li>• Project Guidelines</li>
                                <li>• Submission Portal</li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-green-200">
                        <p class="text-sm text-green-700">
                            <strong>Selected:</strong> ${scheme.text} → ${branch.text} → ${semester.text} → ${subject.text}
                        </p>
                    </div>
                </div>
            `;
        } else if (scheme || branch || semester || subject) {
            // Partial selection - show progress
            content = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-yellow-800 mb-4">⚡ Continue Selection</h3>
                    <p class="text-yellow-700 mb-4">Please complete your selection to access specific academic content.</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div class="text-center p-2 ${scheme ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'} rounded">
                            <div class="font-medium">Scheme</div>
                            <div>${scheme ? '✓' : '○'}</div>
                        </div>
                        <div class="text-center p-2 ${branch ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'} rounded">
                            <div class="font-medium">Branch</div>
                            <div>${branch ? '✓' : '○'}</div>
                        </div>
                        <div class="text-center p-2 ${semester ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'} rounded">
                            <div class="font-medium">Semester</div>
                            <div>${semester ? '✓' : '○'}</div>
                        </div>
                        <div class="text-center p-2 ${subject ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'} rounded">
                            <div class="font-medium">Subject</div>
                            <div>${subject ? '✓' : '○'}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // No selection - show default
            content = `
                <div class="bg-gray-50 rounded-lg p-6 text-center">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">No Content Selected</h3>
                    <p class="text-gray-600">Please select your academic preferences from the navigation above to view relevant materials.</p>
                </div>
            `;
        }
        
        dynamicContent.innerHTML = content;
        
        // Hide loading
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        console.log('✅ Content loaded based on current selection');
    }, 1000);
}

/**
 * Get stored selection by type
 */
function getStoredSelection(type) {
    const stored = localStorage.getItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error(`❌ Error parsing stored ${type}:`, e);
            return null;
        }
    }
    return null;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkUserAuthentication,
        initializeDropdowns,
        updateSelection,
        loadContent
    };
}

console.log('✅ SJC Grove Main Page JavaScript loaded successfully');
