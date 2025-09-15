// =============================================================================
// MAIN PAGE - STUCON PROTECTED PAGE
// =============================================================================

let currentUser = null;
let allDocuments = [];

// Current filter state
const filters = {
    "scheme": "All",
    "branch": "All",
    "semester": "All", 
    "subject": "All"
};

// =============================================================================
// STRICT ACCESS CONTROL - RUNS IMMEDIATELY
// =============================================================================

// Validate access BEFORE any other code runs
currentUser = validatePageAccess();
if (!currentUser) {
    // validatePageAccess handles redirect, just stop execution
    throw new Error('Access denied - redirecting to login');
}

console.log('✅ MainPage access granted for:', currentUser.username);

// =============================================================================
// USER INTERFACE UPDATES
// =============================================================================

/**
 * Update user display in navbar with Hello, <name>
 */
function updateUserDisplay() {
    if (!currentUser) {
        console.warn('⚠️ No currentUser available');
        return;
    }
    
    const usernameElement = document.getElementById('username-display');
    const userAvatarElement = document.getElementById('user-avatar');

    if (usernameElement) {
        // Display as "Hello, <name>" where name is everything before @
        usernameElement.textContent = currentUser.username;
        console.log('✅ Username updated:', currentUser.username);
    }

    if (userAvatarElement) {
        const initials = currentUser.username.substring(0, 2).toUpperCase();
        userAvatarElement.textContent = initials;
        console.log('✅ User avatar updated:', initials);
    }
}

// =============================================================================
// LOGOUT FUNCTIONALITY
// =============================================================================

async function handleLogout() {
    try {
        console.log('🔓 Initiating logout...');

        const logoutBtn = document.querySelector('.bg-red-500');
        if (!logoutBtn) return;

        const originalText = logoutBtn.innerHTML;

        // Show loading state
        //logoutBtn.disabled = true;
        /*logoutBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging out...
        `;
*/ 
        // Try backend logout
        try {
            console.log('req sent logout');
            const response = await fetch('/api/user/logout', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: getCookie('stucon_userEmail'),
                    token: getCookie('stucon_session')
                })
            });

            if (response.status === 200) {
                console.log('✅ Backend logout successful');
            } else {
                console.error('⚠️ Logout failed with status:', response.status);
                throw new Error('Session error: invalid or expired token');
            }
        } catch (error) {
            console.log('⚠️ Backend logout failed, proceeding with frontend logout');
        }

        // Always clear stucon session
        clearLoginSession();
        //alert('Logout successful! You will be redirected to the login page.');
        window.location.href = '/src/pages/login/loginPage.html';

    } catch (error) {
        console.error('❌ Logout error:', error);
        clearLoginSession();
        window.location.href = '/src/pages/login/loginPage.html';
    }
}


// =============================================================================
// UPLOAD FUNCTIONALITY
// =============================================================================

function handleUploadClick() {
    console.log('📤 Redirecting to upload page');
    // No need to check login again - already validated on page load
    window.location.href = '/src/pages/upload/uploadPage.html';
}

// =============================================================================
// DOCUMENT MANAGEMENT
// =============================================================================


function getSampleDocuments() {
    return [
        {
            "id": 1,
            "title": "Mathematics Assignment 1",
            "scheme": "2022",
            "branch": "Computer Science Engineering",
            "semester": "3",
            "subject": "Mathematics",
            "uploadDate": "2024-09-10",
            "fileType": "PDF",
            "downloadUrl": "#"
        },
        {
            "id": 2,
            "title": "Physics Lab Manual", 
            "scheme": "2022",
            "branch": "Electronics & Communication",
            "semester": "2",
            "subject": "Physics",
            "uploadDate": "2024-09-09",
            "fileType": "PDF",
            "downloadUrl": "#"
        },
        {
            "id": 3,
            "title": "Programming Notes",
            "scheme": "2020",
            "branch": "Computer Science Engineering", 
            "semester": "1",
            "subject": "Programming",
            "uploadDate": "2024-09-08",
            "fileType": "DOC",
            "downloadUrl": "#"
        },
        {
            "id": 4,
            "title": "Data Structures Tutorial",
            "scheme": "2022",
            "branch": "Computer Science Engineering",
            "semester": "4", 
            "subject": "Data Structures",
            "uploadDate": "2024-09-07",
            "fileType": "PDF",
            "downloadUrl": "#"
        },
        {
            "id": 5,
            "title": "Database Management Systems",
            "scheme": "2020",
            "branch": "Computer Science Engineering",
            "semester": "5",
            "subject": "Database Management",
            "uploadDate": "2024-09-06",
            "fileType": "PDF",
            "downloadUrl": "#"
        },
        {
            "id": 6,
            "title": "Network Security Fundamentals",
            "scheme": "2022",
            "branch": "Electronics & Communication",
            "semester": "6",
            "subject": "Computer Networks",
            "uploadDate": "2024-09-05",
            "fileType": "PDF",
            "downloadUrl": "#"
        },
        {
            "id": 7,
            "title": "Software Engineering Principles",
            "scheme": "2024",
            "branch": "Computer Science Engineering",
            "semester": "7",
            "subject": "Software Engineering",
            "uploadDate": "2024-09-04",
            "fileType": "PDF",
            "downloadUrl": "#"
        },
        {
            "id": 8,
            "title": "Operating Systems Concepts",
            "scheme": "2020",
            "branch": "Computer Science Engineering",
            "semester": "8",
            "subject": "Operating Systems",
            "uploadDate": "2024-09-03",
            "fileType": "PDF",
            "downloadUrl": "#"
        }
    ];
}

/**
 * Filter documents based on current filter state
 */
function getFilteredDocuments() {
    let filteredDocs = allDocuments;
    
    if (filters["scheme"] !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc["scheme"] === filters["scheme"]);
    }
    
    if (filters["branch"] !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc["branch"] === filters["branch"]);
    }
    
    if (filters["semester"] !== "All") {
        filteredDocs = filteredDocs.filter(doc => doc["semester"] === filters["semester"]);
    }
    
    if (filters["subject"] !== "All") {
        filteredDocs = filteredDocs.filter(doc => 
            doc["subject"].toLowerCase().includes(filters["subject"].toLowerCase()));
    }
    
    console.log(`📋 Filtered ${filteredDocs.length} documents from ${allDocuments.length} total`);
    return filteredDocs;
}
//Render documents in the grid
function renderDocuments(docs = []) {
  const content = document.getElementById("content");
  const noResults = document.getElementById("no-results");
  const resultsTitle = document.getElementById("results-title");

  content.innerHTML = "";

  if (!docs.length) {
    noResults.classList.remove("hidden");
    resultsTitle.textContent = "No Documents Found";
    return;
  }

  noResults.classList.add("hidden");

  // Add cards
  docs.forEach(doc => {
    const card = document.createElement("div");
    card.className = "card bg-white rounded-lg shadow p-4";
    card.innerHTML = `
      <h3 class="text-lg font-bold text-gray-800">${doc.title}</h3>
      <p class="text-gray-600 text-sm">${doc.description || "No description available"}</p>
    `;
    content.appendChild(card);
  });

  // 🔥 Update header dynamically
  resultsTitle.textContent = `Showing ${docs.length} Document${docs.length > 1 ? "s" : ""}`;
}

/**
 * Render documents in the grid
 */
function renderDocuments() {
    const contentDiv = document.getElementById('content');
    const resultsTitle = document.getElementById('results-title');
    const noResults = document.getElementById('no-results');
    
    if (!contentDiv || !resultsTitle || !noResults) {
        console.error('❌ Required DOM elements not found');
        return;
    }
    
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
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.fileType === 'PDF' ? 'bg-red-100 text-red-800' : 
                        doc.fileType === 'DOC' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                    }">
                        ${doc.fileType}
                    </span>
                    <p class="text-xs text-gray-500 mt-2">${doc.uploadDate}</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="downloadDocument(${doc.id})" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Download
                </button>
                <button onclick="previewDocument(${doc.id})" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    Preview
                </button>
            </div>
        </div>
    `).join('');
    
    contentDiv.innerHTML = cardsHTML;
    console.log(`✅ Rendered ${filteredDocuments.length} document cards`);
}

function downloadDocument(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    if (doc) {
        console.log('📥 Downloading document:', doc.title);
        // Redirect to title page for now
        window.location.href = `/src/pages/title/titlePage.html?id=${docId}`;
    }
}

function previewDocument(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    if (doc) {
        console.log('👁️ Previewing document:', doc.title);
        console.log('🔗 Redirecting to title page with ID:', docId);
        
        // Redirect to title page with document ID
        window.location.href = `/src/pages/title/titlePage.html?id=${docId}`;
    } else {
        console.error('❌ Document not found with ID:', docId);
        //alert('Document not found!');
    }
}

// =============================================================================
// DROPDOWN FUNCTIONALITY
// =============================================================================

/**
 * Populate dropdowns with data
 */
async function populateDropdowns() {
    try {
        console.log('📋 Populating dropdowns...');
        
        const schemes = [...new Set(allDocuments.map(doc => doc.scheme))].sort();
        const branches = [...new Set(allDocuments.map(doc => doc.branch))].sort();
        const subjects = [...new Set(allDocuments.map(doc => doc.subject))].sort();
        
        populateDropdown('scheme', schemes, 'Schemes');
        populateDropdown('branch', branches, 'Branches'); 
        populateDropdown('subject', subjects, 'Subjects');
        
        console.log('✅ Dropdowns populated');
    } catch (error) {
        console.error('❌ Error populating dropdowns:', error);
    }
}

function populateDropdown(filterType, options, label) {
    const dropdown = document.querySelector(`[data-filter="${filterType}"]`);
    if (!dropdown) {
        console.warn(`⚠️ Dropdown not found for filter: ${filterType}`);
        return;
    }
    
    const dropdownMenu = dropdown.nextElementSibling;
    if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown')) {
        console.warn(`⚠️ Dropdown menu not found for filter: ${filterType}`);
        return;
    }
    
    let html = `<li data-value="All" class="selected">All ${label}</li>`;
    options.forEach(option => {
        html += `<li data-value="${option}">${option}</li>`;
    });
    
    dropdownMenu.innerHTML = html;
    console.log(`✅ Populated ${filterType} dropdown with ${options.length} options`);
}

function initializeDropdownHandlers() {
    console.log('🎛️ Initializing dropdown handlers');
    
    // Dropdown button clicks
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.stopPropagation();
            
            const dropdown = tab.nextElementSibling;
            if (!dropdown || !dropdown.classList.contains('dropdown')) {
                console.warn('⚠️ No dropdown found for tab:', tab);
                return;
            }
            
            const isOpen = dropdown.classList.contains("show");
            
            // Close all dropdowns
            document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
            document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove('active'));
            
            // Open current dropdown if it wasn't open
            if (!isOpen) {
                dropdown.classList.add("show");
                tab.classList.add('active');
                console.log('✅ Dropdown opened for:', tab.getAttribute('data-filter'));
            } else {
                console.log('✅ Dropdown closed for:', tab.getAttribute('data-filter'));
            }
        });
    });
    
    // Dropdown item clicks
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' && e.target.hasAttribute('data-value')) {
            e.stopPropagation();
            
            const dropdown = e.target.closest('.dropdown');
            const button = dropdown?.previousElementSibling;
            if (!button) return;
            
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
    
    console.log('✅ Dropdown handlers initialized');
}

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
    updateFilterCount();
}

function updateFilterCount() {
    const filterCount = document.getElementById('filter-count');
    const activeFilters = Object.values(filters).filter(v => v !== 'All').length;
    
    if (filterCount) {
        filterCount.textContent = activeFilters > 0 ? 
            `${activeFilters} filter${activeFilters > 1 ? 's' : ''} active` : '';
    }
}

function clearAllFilters() {
    console.log('🧹 Clearing all filters...');
    
    // Reset filter state
    filters["scheme"] = "All";
    filters["branch"] = "All";
    filters["semester"] = "All";
    filters["subject"] = "All";
    
    // Reset button texts and indicators
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const filterType = tab.getAttribute('data-filter');
        if (!filterType) return;
        
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
    
    console.log('✅ All filters cleared');
}

// =============================================================================
// PAGE INITIALIZATION - AFTER ACCESS VALIDATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Stucon Main Page initializing (user authenticated)...');
    
    // User is already validated at top of file, so we can proceed
    
    // 1. Update user display
    updateUserDisplay();
    
    // 2. Initialize event handlers immediately
    initializeDropdownHandlers();
    
    // 3. Initialize upload buttons
    const uploadBtn = document.getElementById('upload-btn');
    const uploadBtnMobile = document.getElementById('upload-btn-mobile');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleUploadClick();
        });
        console.log('✅ Desktop upload button initialized');
    }
    
    if (uploadBtnMobile) {
        uploadBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            handleUploadClick();
        });
        console.log('✅ Mobile upload button initialized');
    }
    

// API call to fetch Dropdown - schemes
async function fetchSchemes() {
  try {
    const response = await fetch('/api/explore/getscheme', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Schemes fetched:", data.strArr);

    const dropdown = document.getElementById('scheme-dropdown');

    // Remove old <li> except "All Schemes"
    dropdown.querySelectorAll('li:not([data-value="All"])').forEach(li => li.remove());

    // Insert new schemes
    data.strArr.forEach(scheme => {
      const li = document.createElement('li');
      li.setAttribute('data-value', scheme);  // string itself as value
      li.textContent = scheme;                // show directly
      dropdown.appendChild(li);
    });

  } catch (error) {
    console.error("❌ Error fetching schemes:", error);
  }
}


// API call to fetch Dropdown - branches
async function fetchBranches() {
  try {
    const response = await fetch('/api/explore/getbranch', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Branches fetched:", data.branchArr);

    const dropdown = document.getElementById('branch-dropdown');

    // Remove old <li> except "All Branches"
    dropdown.querySelectorAll('li:not([data-value="All"])').forEach(li => li.remove());

    // Insert new branches
    data.strArr.forEach(branch => {
      const li = document.createElement('li');
      li.setAttribute('data-value', branch);
      li.textContent = branch;
      dropdown.appendChild(li);
    });

  } catch (error) {
    console.error("❌ Error fetching branches:", error);
  }
}



//API for subjects
async function fetchSubjects(branchId, semester) {
    try {
        const response = await fetch(`/api/explore/getsub?branch_id=${branchId}&semester=${semester}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Subjects fetched:", data.subjectArr);

        const dropdown = document.getElementById('subject-dropdown');

        // Remove old <li> except "All Subjects"
        dropdown.querySelectorAll('li:not([data-value="All"])').forEach(li => li.remove());

        // Insert new subjects
        data.subjectArr.forEach(subject => {
        const li = document.createElement('li');
        li.setAttribute('data-value', subject.subjectID);  // ID goes in data-value
        li.textContent = subject.subjectName;              // Display the name
        dropdown.appendChild(li);
    });

    } catch (error) {
        console.error("❌ Error fetching subjects:", error);
    }
}


//

// Call this after DOM loads
document.addEventListener("DOMContentLoaded", fetchSchemes);

    // 4. Initialize logout handler
    const logoutButton = document.querySelector('.bg-red-500');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            //]const confirmLogout = confirm('Are you sure you want to logout?');
            if (confirmLogout) {
                await handleLogout();
            }
        });
        console.log('✅ Logout button initialized');
    }
    
    // 5. Initialize clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
        console.log('✅ Clear filters button initialized');
    }
    
// 6. Fetch schemes and branches directly from backend
Promise.all([fetchSchemes(), fetchBranches()])
  .then(() => {
    // Optionally load sample documents or real docs from backend
    allDocuments = getSampleDocuments(); // Replace with real fetch later

    renderDocuments();
    updateFilterCount();
    console.log('✅ Schemes & branches loaded, documents rendered');
  })
  .catch(error => {
    console.error('❌ Error during initialization:', error);
  });

    
    console.log('✅ Main page initialization complete - Stucon session active!');
});

console.log("✅ Stucon Main Page Script Loaded - PROTECTED WITH SESSION VALIDATION!");
