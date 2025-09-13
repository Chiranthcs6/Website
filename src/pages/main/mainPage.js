// =============================================================================
// SESSION VALIDATION & USER AUTHENTICATION
// =============================================================================

let currentUser = null;

// Check if user has valid session using companion cookie
function hasAuthCookie() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'is_authenticated' && value === 'true') {
            return true;
        }
    }
    return false;
}

// Validate session with backend
async function validateSession() {
    try {
        console.log('🔍 Validating session with backend...');
        
        const response = await fetch('/api/auth/validate', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.valid) {
                currentUser = data.user;
                console.log('✅ Session valid:', currentUser);
                return true;
            }
        }
        
        console.log('❌ Session invalid or expired');
        return false;
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
        usernameElement.textContent = currentUser.username;
    }
    
    if (userAvatarElement) {
        const initials = currentUser.username.substring(0, 2).toUpperCase();
        userAvatarElement.textContent = initials;
    }
    
    console.log(`✅ User display updated: ${currentUser.username} (${currentUser.email})`);
}

// Redirect to login page
function redirectToLogin(message = 'Please log in to access this page.') {
    console.log('🔒 Redirecting to login page:', message);
    alert(message);
    window.location.href = '../login/loginPage.html';
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
// LOGOUT FUNCTIONALITY
// =============================================================================

async function handleLogout() {
    try {
        console.log('🔓 Initiating logout...');
        
        const logoutBtn = document.querySelector('.bg-red-500');
        if (logoutBtn) {
            const originalText = logoutBtn.innerHTML;
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
            `;
            
            const apiResponse = await fetch('/api/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (apiResponse.ok) {
                console.log('✅ Logout successful');
                alert('Logout successful! You will be redirected to the login page.');
                window.location.href = '../login/loginPage.html';
            } else {
                const errorData = await apiResponse.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Logout failed';
                
                console.error('❌ Logout failed:', errorMessage);
                alert(`Logout failed: ${errorMessage}`);
                
                logoutBtn.disabled = false;
                logoutBtn.innerHTML = originalText;
            }
        }
        
    } catch (error) {
        console.error('❌ Network error during logout:', error);
        alert('Network error during logout. Please try again.');
        
        const logoutBtn = document.querySelector('.bg-red-500');
        if (logoutBtn) {
            logoutBtn.disabled = false;
            logoutBtn.innerHTML = 'Logout';
        }
    }
}

// =============================================================================
// PERIODIC SESSION CHECK
// =============================================================================

function startSessionMonitoring() {
    setInterval(async () => {
        console.log('🔍 Periodic session check...');
        
        if (!hasAuthCookie()) {
            redirectToLogin('Session expired during usage.');
            return;
        }
        
        const isValid = await validateSession();
        if (!isValid) {
            redirectToLogin('Session expired. Please log in again.');
        }
    }, 10 * 60 * 1000);
}

// =============================================================================
// UPLOAD BUTTON FUNCTIONALITY
// =============================================================================

function handleUploadRedirect() {
    console.log('📤 Redirecting to upload page...');
    storeFilterValuesInSession();
    window.location.href = '../src/pages/upload/uploadPage.html';
}

function initializeUploadButtons() {
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleUploadRedirect();
        });
        console.log('✅ Desktop upload button handler attached');
    }
    
    const uploadBtnMobile = document.getElementById('upload-btn-mobile');
    if (uploadBtnMobile) {
        uploadBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            handleUploadRedirect();
        });
        console.log('✅ Mobile upload button handler attached');
    }
}

// =============================================================================
// API INTEGRATION FOR DYNAMIC DROPDOWNS
// =============================================================================

// API Cache to avoid repeated calls
const apiCache = {
    schemes: null,
    branches: null,
    subjects: {}
};

// Filter state with IDs for API calls
const filters = {
    scheme: "All",
    schemeID: null,
    branch: "All",
    branchID: null,
    semester: "All",
    subject: "All",
    subjectID: null
};

// ✅ NEW: Fetch schemes from API
async function fetchSchemes() {
    try {
        console.log('🔍 Fetching schemes from API...');
        
        const response = await fetch('/api/explore/getscheme', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            apiCache.schemes = data.strArr || [];
            console.log('✅ Schemes fetched:', apiCache.schemes);
            return apiCache.schemes;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error fetching schemes:', error);
        return [];
    }
}

// ✅ NEW: Fetch branches from API
async function fetchBranches() {
    try {
        console.log('🔍 Fetching branches from API...');
        
        const response = await fetch('/api/explore/getbranch', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            apiCache.branches = data.BranchArr || [];
            console.log('✅ Branches fetched:', apiCache.branches);
            return apiCache.branches;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error fetching branches:', error);
        return [];
    }
}

// ✅ NEW: Fetch subjects from API
async function fetchSubjects(branchID, semester) {
    try {
        const cacheKey = `${branchID}_${semester}`;
        
        // Check cache first
        if (apiCache.subjects[cacheKey]) {
            console.log('📋 Using cached subjects for:', cacheKey);
            return apiCache.subjects[cacheKey];
        }
        
        console.log('🔍 Fetching subjects from API for branch:', branchID, 'semester:', semester);
        
        const response = await fetch(`/api/explore/getsub?branch_id=${encodeURIComponent(branchID)}&sem=${encodeURIComponent(semester)}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const subjects = data.SubjectArr || [];
            
            // Cache the result
            apiCache.subjects[cacheKey] = subjects;
            
            console.log('✅ Subjects fetched:', subjects);
            return subjects;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error fetching subjects:', error);
        return [];
    }
}

// =============================================================================
// DROPDOWN POPULATION FUNCTIONS
// =============================================================================

// ✅ NEW: Populate scheme dropdown
async function populateSchemeDropdown() {
    const schemeDropdown = document.getElementById('scheme-dropdown');
    const schemeButton = document.querySelector('[data-filter="scheme"]');
    
    // Show loading
    schemeDropdown.innerHTML = '<li class="disabled">Loading schemes...</li>';
    
    const schemes = await fetchSchemes();
    
    if (schemes.length === 0) {
        schemeDropdown.innerHTML = '<li class="disabled">No schemes available</li>';
        return;
    }
    
    // Build dropdown HTML
    let html = '<li data-value="All" data-id="" class="selected">All Schemes</li>';
    schemes.forEach(scheme => {
        html += `<li data-value="${scheme}" data-id="${scheme}">${scheme}</li>`;
    });
    
    schemeDropdown.innerHTML = html;
    
    // Enable scheme button
    schemeButton.disabled = false;
    
    console.log('✅ Scheme dropdown populated with', schemes.length, 'schemes');
}

// ✅ NEW: Populate branch dropdown
async function populateBranchDropdown() {
    const branchDropdown = document.getElementById('branch-dropdown');
    const branchButton = document.querySelector('[data-filter="branch"]');
    
    // Show loading
    branchDropdown.innerHTML = '<li class="disabled">Loading branches...</li>';
    
    const branches = await fetchBranches();
    
    if (branches.length === 0) {
        branchDropdown.innerHTML = '<li class="disabled">No branches available</li>';
        return;
    }
    
    // Build dropdown HTML
    let html = '<li data-value="All" data-id="" class="selected">All Branches</li>';
    branches.forEach(branch => {
        html += `<li data-value="${branch.branchName}" data-id="${branch.branchID}">${branch.branchName}</li>`;
    });
    
    branchDropdown.innerHTML = html;
    
    // Enable branch button
    branchButton.disabled = false;
    
    console.log('✅ Branch dropdown populated with', branches.length, 'branches');
}

// ✅ NEW: Populate semester dropdown (static semesters 1-8)
function populateSemesterDropdown() {
    const semesterDropdown = document.getElementById('semester-dropdown');
    const semesterButton = document.querySelector('[data-filter="semester"]');
    
    let html = '<li data-value="All" data-id="" class="selected">All Semesters</li>';
    for (let i = 1; i <= 8; i++) {
        html += `<li data-value="${i}" data-id="${i}">Semester ${i}</li>`;
    }
    
    semesterDropdown.innerHTML = html;
    semesterButton.disabled = false;
    
    console.log('✅ Semester dropdown populated');
}

// ✅ NEW: Populate subject dropdown
async function populateSubjectDropdown() {
    const subjectDropdown = document.getElementById('subject-dropdown');
    const subjectButton = document.querySelector('[data-filter="subject"]');
    
    if (!filters.branchID || !filters.semester || filters.semester === "All") {
        subjectDropdown.innerHTML = '<li class="disabled">Select branch and semester first</li>';
        subjectButton.disabled = true;
        return;
    }
    
    // Show loading
    subjectDropdown.innerHTML = '<li class="disabled">Loading subjects...</li>';
    
    const subjects = await fetchSubjects(filters.branchID, filters.semester);
    
    if (subjects.length === 0) {
        subjectDropdown.innerHTML = '<li class="disabled">No subjects available</li>';
        subjectButton.disabled = true;
        return;
    }
    
    // Build dropdown HTML
    let html = '<li data-value="All" data-id="" class="selected">All Subjects</li>';
    subjects.forEach(subject => {
        html += `<li data-value="${subject.subjectName}" data-id="${subject.subjectID}">${subject.subjectName}</li>`;
    });
    
    subjectDropdown.innerHTML = html;
    subjectButton.disabled = false;
    
    console.log('✅ Subject dropdown populated with', subjects.length, 'subjects');
}

// =============================================================================
// DROPDOWN EVENT HANDLERS
// =============================================================================

// ✅ NEW: Handle dropdown selections with cascading updates
function handleDropdownSelection(filterType, value, id, text) {
    console.log(`Filter selected: ${filterType} = ${value} (ID: ${id})`);
    
    // Update filter state
    filters[filterType] = value;
    if (filterType === 'scheme') {
        filters.schemeID = id;
    } else if (filterType === 'branch') {
        filters.branchID = id;
        // Reset dependent dropdowns
        resetSubjectDropdown();
        filters.subject = "All";
        filters.subjectID = null;
    } else if (filterType === 'semester') {
        // Reset subject dropdown
        resetSubjectDropdown();
        filters.subject = "All";
        filters.subjectID = null;
    } else if (filterType === 'subject') {
        filters.subjectID = id;
    }
    
    // Handle cascading updates
    if (filterType === 'scheme' && value !== "All") {
        populateBranchDropdown();
        populateSemesterDropdown();
    } else if (filterType === 'branch' && value !== "All") {
        if (filters.semester !== "All") {
            populateSubjectDropdown();
        }
    } else if (filterType === 'semester' && value !== "All") {
        if (filters.branchID) {
            populateSubjectDropdown();
        }
    }
    
    // Store filter values
    storeFilterValuesInSession();
    
    // Update UI and render results
    updateFilterIndicators();
    renderDocuments();
}

// ✅ NEW: Reset subject dropdown
function resetSubjectDropdown() {
    const subjectDropdown = document.getElementById('subject-dropdown');
    const subjectButton = document.querySelector('[data-filter="subject"]');
    
    subjectDropdown.innerHTML = '<li class="disabled">Select branch and semester first</li>';
    subjectButton.disabled = true;
    
    // Update button text
    subjectButton.textContent = 'Subject';
    const indicator = subjectButton.querySelector('.filter-indicator');
    if (indicator) subjectButton.appendChild(indicator);
}

// =============================================================================
// DOCUMENT RENDERING (PLACEHOLDER)
// =============================================================================

// ✅ NEW: Render documents based on current filters
function renderDocuments() {
    const contentDiv = document.getElementById('content');
    const resultsTitle = document.getElementById('results-title');
    
    // For now, show placeholder - replace with actual document fetching
    contentDiv.innerHTML = `
        <div class="col-span-full text-center py-8">
            <p class="text-gray-500 mb-4">Document fetching will be implemented here</p>
            <p class="text-sm text-gray-400">Current filters: 
                Scheme: ${filters.scheme || 'All'}, 
                Branch: ${filters.branch || 'All'}, 
                Semester: ${filters.semester || 'All'}, 
                Subject: ${filters.subject || 'All'}
            </p>
        </div>
    `;
    
    resultsTitle.textContent = `Documents (Filtered)`;
    
    console.log('📋 Current filter state:', filters);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getCurrentFilterValues() {
    return {
        scheme: filters.scheme,
        schemeID: filters.schemeID,
        branch: filters.branch,
        branchID: filters.branchID,
        semester: filters.semester,
        subject: filters.subject,
        subjectID: filters.subjectID
    };
}

function storeFilterValuesInSession() {
    const filterValues = getCurrentFilterValues();
    sessionStorage.setItem('documentFilters', JSON.stringify(filterValues));
    console.log('Filter values stored in session:', filterValues);
}

function updateFilterIndicators() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const filterType = tab.getAttribute('data-filter');
        const indicator = tab.querySelector('.filter-indicator');
        
        if (filters[filterType] !== "All") {
            if (indicator) indicator.classList.remove('hidden');
            tab.classList.add('active');
        } else {
            if (indicator) indicator.classList.add('hidden');
            tab.classList.remove('active');
        }
    });
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

function initializeDropdownHandlers() {
    // Dropdown button clicks
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.stopPropagation();
            
            if (tab.disabled) return;
            
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
    
    // Dropdown item clicks (using event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' && e.target.hasAttribute('data-value') && !e.target.classList.contains('disabled')) {
            e.stopPropagation();
            
            const dropdown = e.target.closest('.dropdown');
            const button = dropdown.previousElementSibling;
            const filterType = dropdown.getAttribute('data-filter');
            const value = e.target.getAttribute('data-value');
            const id = e.target.getAttribute('data-id');
            const text = e.target.textContent;
            
            // Update button text
            const indicator = button.querySelector('.filter-indicator');
            button.textContent = value === 'All' ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : text;
            if (indicator) button.appendChild(indicator);
            
            // Update selected state
            dropdown.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            e.target.classList.add('selected');
            
            // Close dropdown
            dropdown.classList.remove('show');
            button.classList.remove('active');
            
            // Handle the selection
            handleDropdownSelection(filterType, value, id, text);
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

// Clear filters functionality
function initializeClearFilters() {
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            // Reset all filters
            filters.scheme = "All";
            filters.schemeID = null;
            filters.branch = "All";
            filters.branchID = null;
            filters.semester = "All";
            filters.subject = "All";
            filters.subjectID = null;
            
            // Reset all dropdown texts
            document.querySelectorAll('.nav-tab').forEach(tab => {
                const filterType = tab.getAttribute('data-filter');
                const indicator = tab.querySelector('.filter-indicator');
                tab.textContent = filterType.charAt(0).toUpperCase() + filterType.slice(1);
                if (indicator) tab.appendChild(indicator);
                
                // Disable dependent dropdowns
                if (filterType !== 'scheme') {
                    tab.disabled = true;
                }
            });
            
            // Reset dropdown selections
            document.querySelectorAll('.dropdown li').forEach(li => {
                li.classList.remove('selected');
                if (li.getAttribute('data-value') === 'All') {
                    li.classList.add('selected');
                }
            });
            
            // Reset dependent dropdowns
            resetSubjectDropdown();
            
            // Repopulate from scratch
            await populateSchemeDropdown();
            
            // Update UI
            storeFilterValuesInSession();
            updateFilterIndicators();
            renderDocuments();
            
            console.log("All filters cleared");
        });
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 Stucon Main Page initialized with API integration');
    
    // Check authentication first
    const isAuthenticated = await checkAuthenticationAndRedirect();
    if (!isAuthenticated) {
        return;
    }
    
    // Update user display
    updateUserDisplay();
    
    // Start session monitoring
    startSessionMonitoring();
    
    // Initialize upload buttons
    initializeUploadButtons();
    
    // ✅ NEW: Initialize API-driven dropdowns
    await populateSchemeDropdown();
    
    // Initialize event handlers
    initializeDropdownHandlers();
    initializeClearFilters();
    
    // Attach logout handler
    const logoutButton = document.querySelector('.bg-red-500');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const confirmLogout = confirm('Are you sure you want to logout?');
            if (confirmLogout) {
                await handleLogout();
            }
        });
        console.log('✅ Logout button handler attached');
    }
    
    // Initial render
    renderDocuments();
    
    console.log('✅ Main page ready with API-driven filtering!');
});

console.log("✅ Stucon Main Page - Ready with API integration!");
