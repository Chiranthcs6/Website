// =============================================================================
// SESSION VALIDATION & USER AUTHENTICATION
// =============================================================================

let currentUser = null;
let allDocuments = [];

// Current filter state
const filters = {
    scheme: "All",
    branch: "All",
    semester: "All", 
    subject: "All"
};

// Helper: read cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Check if user has valid session using companion cookie
function hasAuthCookie() {
    return getCookie('is_logged_in') === 'true';
}

// Validate session with backend
async function validateSession() {
    try {
        console.log('🔍 Validating session with backend...');
        const email = getCookie('user_email');
        const token = getCookie('session_token');
        
        if (!email || !token) {
            console.log('❌ Missing email or token in cookies');
            return false;
        }

        const response = await fetch('/api/user/validate', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": email, "token": token })
        });

        if (response.status === 200) {
            console.log('✅ Session valid');
            currentUser = { email: email, username: email.split('@')[0] };
            return true;
        } else {
            console.log('❌ Session invalid or expired');
            return false;
        }
    } catch (error) {
        console.error('❌ Session validation error:', error);
        return false;
    }
}

// Update user display
function updateUserDisplay() {
    if (!currentUser) return;
    
    const usernameElement = document.getElementById('username-display');
    const userAvatarElement = document.getElementById('user-avatar');

    if (usernameElement) {
        usernameElement.textContent = currentUser.username || currentUser.email;
    }

    if (userAvatarElement) {
        const initials = (currentUser.username || currentUser.email)
            .substring(0, 2)
            .toUpperCase();
        userAvatarElement.textContent = initials;
    }
}

// Redirect to login page
function redirectToLogin(message = 'Please log in to access this page.') {
    // console.log('🔒 Redirecting to login page:', message);
    // window.location.href = '../login/loginPage.html';
}

// Check authentication and redirect if necessary
async function checkAuthenticationAndRedirect() {
    if (!hasAuthCookie()) {
        redirectToLogin('Session expired or not logged in.');
        return false;
    }
    
    const isValid = await validateSession();
    if (!isValid) {
        redirectToLogin('Session expired. Please log in again.');
        return false;
    }
    
    return true;
}

// =============================================================================
// DOCUMENT MANAGEMENT
// =============================================================================

// Fetch documents from backend or use sample data
async function fetchDocuments() {
    try {
        console.log('📋 Fetching documents...');
        
        const response = await fetch('/api/documents/all', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            allDocuments = data.documents || [];
            console.log('✅ Documents fetched:', allDocuments.length);
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.log('📋 Using sample documents for testing');
        allDocuments = getSampleDocuments();
    }
}

// Sample documents for testing
function getSampleDocuments() {
    return [
        {
            id: 1,
            title: "Mathematics Assignment 1",
            scheme: "2022",
            branch: "Computer Science",
            semester: "3", 
            subject: "Mathematics",
            uploadDate: "2024-09-10",
            fileType: "PDF"
        },
        {
            id: 2,
            title: "Physics Lab Manual",
            scheme: "2022", 
            branch: "Electronics",
            semester: "2",
            subject: "Physics",
            uploadDate: "2024-09-09",
            fileType: "PDF"
        },
        {
            id: 3,
            title: "Programming Notes",
            scheme: "2020",
            branch: "Computer Science", 
            semester: "1",
            subject: "Programming",
            uploadDate: "2024-09-08", 
            fileType: "DOC"
        },
        {
            id: 4,
            title: "Data Structures Tutorial",
            scheme: "2022",
            branch: "Computer Science",
            semester: "4",
            subject: "Data Structures", 
            uploadDate: "2024-09-07",
            fileType: "PDF"
        },
        {
            id: 5,
            title: "DBMS Lab Exercise",
            scheme: "2020",
            branch: "Computer Science",
            semester: "5",
            subject: "DBMS",
            uploadDate: "2024-09-06", 
            fileType: "PDF"
        },
        {
            id: 6,
            title: "Network Configuration Guide",
            scheme: "2024",
            branch: "Electronics", 
            semester: "6",
            subject: "Networks",
            uploadDate: "2024-09-05",
            fileType: "DOC"
        }
    ];
}

// Filter documents based on current filter state
function getFilteredDocuments() {
    let filteredDocs = allDocuments;
    
    if (filters.scheme !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc.scheme === filters.scheme);
    }
    
    if (filters.branch !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc.branch === filters.branch);
    }
    
    if (filters.semester !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc.semester === filters.semester);
    }
    
    if (filters.subject !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc.subject === filters.subject);
    }
    
    console.log(`📋 Filtered ${filteredDocs.length} documents from ${allDocuments.length} total`);
    return filteredDocs;
}

// Render documents in the grid
function renderDocuments() {
    const contentDiv = document.getElementById('content');
    const resultsTitle = document.getElementById('results-title');
    const noResults = document.getElementById('no-results');
    
    const filteredDocuments = getFilteredDocuments();
    
    if (filteredDocuments.length === 0) {
        contentDiv.innerHTML = '';
        noResults.classList.remove('hidden');
        resultsTitle.textContent = 'No Documents Found';
        return;
    }
    
    noResults.classList.add('hidden');
    resultsTitle.textContent = `Documents (${filteredDocuments.length})`;
    
    // Generate document cards
    const cardsHTML = filteredDocuments.map(doc => `
        <div class="card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${doc.title}</h3>
                    <div class="space-y-1 text-sm text-gray-600">
                        <p><span class="font-medium">Scheme:</span> ${doc.scheme}</p>
                        <p><span class="font-medium">Branch:</span> ${doc.branch}</p>
                        <p><span class="font-medium">Semester:</span> ${doc.semester}</p>
                        <p><span class="font-medium">Subject:</span> ${doc.subject}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.fileType === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
                        ${doc.fileType}
                    </span>
                    <p class="text-xs text-gray-500 mt-2">${doc.uploadDate}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Download
                </button>
                <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    Preview
                </button>
            </div>
        </div>
    `).join('');
    
    contentDiv.innerHTML = cardsHTML;
    
    console.log(`✅ Rendered ${filteredDocuments.length} document cards`);
}

// =============================================================================
// DROPDOWN FUNCTIONALITY
// =============================================================================

// Handle dropdown selection
function handleDropdownSelection(filterType, value, buttonElement) {
    console.log(`📋 Filter selected: ${filterType} = ${value}`);
    
    // Update filter state
    filters[filterType] = value;
    
    // Update button text
    const buttonText = value === 'All' ? 
        filterType.charAt(0).toUpperCase() + filterType.slice(1) : 
        (value.length > 15 ? value.substring(0, 15) + '...' : value);
    
    // Preserve the indicator
    const indicator = buttonElement.querySelector('.filter-indicator');
    buttonElement.textContent = buttonText;
    if (indicator) {
        buttonElement.appendChild(indicator);
        
        // Show/hide indicator based on selection
        if (value !== 'All') {
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }
    
    // Re-render documents with new filters
    renderDocuments();
    
    // Update filter count display
    updateFilterCount();
    
    console.log('📋 Current filters:', filters);
}

// Update filter count display
function updateFilterCount() {
    const filterCount = document.getElementById('filter-count');
    const activeFilters = Object.values(filters).filter(v => v !== 'All').length;
    
    if (filterCount) {
        filterCount.textContent = activeFilters > 0 ? 
            `${activeFilters} filter${activeFilters > 1 ? 's' : ''} active` : '';
    }
}

// Clear all filters
function clearAllFilters() {
    // Reset filter state
    filters.scheme = "All";
    filters.branch = "All";  
    filters.semester = "All";
    filters.subject = "All";
    
    // Reset button texts and indicators
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const filterType = tab.getAttribute('data-filter');
        const indicator = tab.querySelector('.filter-indicator');
        
        tab.textContent = filterType.charAt(0).toUpperCase() + filterType.slice(1);
        if (indicator) {
            tab.appendChild(indicator);
            indicator.classList.add('hidden');
        }
    });
    
    // Reset dropdown selections
    document.querySelectorAll('.dropdown li').forEach(li => {
        li.classList.remove('selected');
        if (li.getAttribute('data-value') === 'All') {
            li.classList.add('selected');
        }
    });
    
    // Re-render documents and update count
    renderDocuments();
    updateFilterCount();
    
    console.log('🧹 All filters cleared');
}

// =============================================================================
// EVENT HANDLERS  
// =============================================================================

// Initialize dropdown event listeners
function initializeDropdownHandlers() {
    // Dropdown button clicks
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.stopPropagation();
            
            const dropdown = tab.nextElementSibling;
            const isOpen = dropdown.classList.contains("show");
            
            // Close all dropdowns
            document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
            document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove('active'));
            
            // Open current dropdown
            if (!isOpen) {
                dropdown.classList.add("show");
                tab.classList.add('active');
            }
        });
    });
    
    // Dropdown item clicks
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' && e.target.hasAttribute('data-value')) {
            e.stopPropagation();
            
            const dropdown = e.target.closest('.dropdown');
            const button = dropdown.previousElementSibling;
            const filterType = dropdown.getAttribute('data-filter');
            const value = e.target.getAttribute('data-value');
            
            // Update selected state
            dropdown.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            e.target.classList.add('selected');
            
            // Close dropdown
            dropdown.classList.remove('show');
            button.classList.remove('active');
            
            // Handle the selection
            handleDropdownSelection(filterType, value, button);
        }
    });
    
    // Close dropdowns on outside click
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".relative")) {
            document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
            document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove('active'));
        }
    });
}

// Initialize upload button handlers
function initializeUploadButtons() {
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../upload/uploadPage.html';
        });
    }
    
    const uploadBtnMobile = document.getElementById('upload-btn-mobile');
    if (uploadBtnMobile) {
        uploadBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../upload/uploadPage.html';
        });
    }
}

// Initialize logout handler
function initializeLogoutHandler() {
    const logoutButton = document.querySelector('.bg-red-500');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const confirmLogout = confirm('Are you sure you want to logout?');
            if (confirmLogout) {
                await handleLogout();
            }
        });
    }
}

// Handle logout
async function handleLogout() {
    try {
        console.log('🔓 Initiating logout...');
        
        const response = await fetch('/api/user/logout', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok || response.status === 404) {
            // Clear cookies manually if API call fails
            document.cookie = 'is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            console.log('✅ Logout successful');
            window.location.href = '../login/loginPage.html';
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('❌ Logout error:', error);
        // Force logout anyway
        document.cookie = 'is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '../login/loginPage.html';
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 Stucon Main Page initialized');
    
    // Check authentication first
    const isAuthenticated = await checkAuthenticationAndRedirect();
    if (!isAuthenticated) {
        return;
    }
    
    // Update user display
    updateUserDisplay();
    
    // Fetch documents
    await fetchDocuments();
    
    // Initialize event handlers
    initializeDropdownHandlers();
    initializeUploadButtons();
    initializeLogoutHandler();
    
    // Initialize clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
    
    // Initial render with all documents
    renderDocuments();
    updateFilterCount();
    
    console.log('✅ Main page ready!');
});

console.log("✅ Stucon Main Page - Ready with working dropdowns!");
