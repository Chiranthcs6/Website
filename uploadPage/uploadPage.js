// =============================================================================
// ✅ USER AUTHENTICATION & SESSION MANAGEMENT (Same as mainPage)
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

// ✅ Update user display dynamically
function updateUserDisplay() {
    if (!currentUser) return;
    
    const usernameElement = document.getElementById('username-display');
    const userAvatarElement = document.getElementById('user-avatar');
    const userDisplayElement = document.getElementById('user-display');
    
    if (usernameElement) {
        usernameElement.textContent = currentUser.username;
    }
    
    if (userAvatarElement) {
        const initials = currentUser.username.substring(0, 2).toUpperCase();
        userAvatarElement.textContent = initials;
    }
    
    if (userDisplayElement) {
        userDisplayElement.textContent = `Hello, ${currentUser.username}`;
    }
    
    console.log(`✅ User display updated: ${currentUser.username} (${currentUser.email})`);
}

// Redirect to login page
function redirectToLogin(message = 'Please log in to access this page.') {
    console.log('🔒 Redirecting to login page:', message);
    alert(message);
    window.location.href = '../loginPage/loginPage.html';
}

// Check authentication and redirect if necessary
async function checkAuthenticationAndRedirect() {
    // Quick check using companion cookie
    if (!hasAuthCookie()) {
        redirectToLogin('Session expired or not logged in.');
        return false;
    }
    
    // Validate with backend
    const isValid = await validateSession();
    if (!isValid) {
        redirectToLogin('Session expired. Please log in again.');
        return false;
    }
    
    return true;
}

// =============================================================================
// ✅ LOGOUT FUNCTIONALITY (Same as mainPage)
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
            
            // Call logout API
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
                window.location.href = '../loginPage/loginPage.html';
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
// ✅ PERIODIC SESSION CHECK (Same as mainPage)
// =============================================================================

// Check session validity every 10 minutes
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
    }, 10 * 60 * 1000); // 10 minutes
}

// =============================================================================
// ✅ INITIALIZE LOGOUT BUTTON
// =============================================================================

function initializeLogoutButton() {
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
}

// =============================================================================
// ✅ API INTEGRATION FOR DYNAMIC DROPDOWNS
// =============================================================================

// API Cache to avoid repeated calls
const apiCache = {
    schemas: null,
    branches: null,
    subjects: {}
};

// Form state with IDs for API calls and title field
const formData = {
    title: '',
    description: '',
    schema: '',
    schemaID: '',
    branch: '',
    branchID: '',
    semester: '',
    subject: '',
    subjectID: '',
    file: null,
    fileType: 'pdf'
};

// Validation rules
const validationRules = {
    title: { required: true, message: 'Please provide a title for the document' },
    description: { required: true, message: 'Please provide a description for the document' },
    schema: { required: true, message: 'Please select a schema' },
    branch: { required: true, message: 'Please select a branch' },
    semester: { required: true, message: 'Please select a semester' },
    subject: { required: true, message: 'Please select a subject' },
    file: { required: true, message: 'Please select a PDF file to upload' }
};

// =============================================================================
// API FUNCTIONS FOR PROPER CLASSIFICATION
// =============================================================================

// Fetch schemas from API
async function fetchSchemas() {
    try {
        console.log('🔍 Fetching schemas from API...');
        
        const response = await fetch('/api/explore/getscheme', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            apiCache.schemas = data.strArr || [];
            console.log('✅ Schemas fetched:', apiCache.schemas);
            return apiCache.schemas;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error fetching schemas:', error);
        return [];
    }
}

// Fetch branches from API
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

// Fetch subjects from API
async function fetchSubjects(branchID, semester) {
    try {
        const cacheKey = `${branchID}_${semester}`;
        
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

// ✅ Enhanced user ID retrieval (consistent with session management)
function getUserIdFromCookie() {
    // First try to get from currentUser (from session validation)
    if (currentUser && currentUser.id) {
        return currentUser.id;
    }
    
    // Fallback to cookie parsing
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'user_id') {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// =============================================================================
// DROPDOWN POPULATION FUNCTIONS
// =============================================================================

// Populate schema dropdown
async function populateSchemaDropdown() {
    const schemaDropdown = document.querySelector('[data-field="schema"]').parentNode.querySelector('.dropdown-menu');
    const schemaButton = document.querySelector('[data-field="schema"]');
    const selectedText = schemaButton.querySelector('.selected-text');
    
    selectedText.textContent = 'Loading schemas...';
    
    const schemas = await fetchSchemas();
    
    if (schemas.length === 0) {
        schemaDropdown.innerHTML = '<div class="dropdown-item disabled">No schemas available</div>';
        selectedText.textContent = 'No schemas available';
        return;
    }
    
    let html = '';
    schemas.forEach(schema => {
        html += `<div class="dropdown-item" data-value="${schema}" data-id="${schema}">${schema}</div>`;
    });
    
    schemaDropdown.innerHTML = html;
    schemaButton.disabled = false;
    selectedText.textContent = 'Select Schema';
    selectedText.classList.remove('text-gray-400');
    selectedText.classList.add('text-gray-500');
    
    console.log('✅ Schema dropdown populated with', schemas.length, 'schemas');
}

// Populate branch dropdown
async function populateBranchDropdown() {
    const branchDropdown = document.querySelector('[data-field="branch"]').parentNode.querySelector('.dropdown-menu');
    const branchButton = document.querySelector('[data-field="branch"]');
    const selectedText = branchButton.querySelector('.selected-text');
    
    selectedText.textContent = 'Loading branches...';
    
    const branches = await fetchBranches();
    
    if (branches.length === 0) {
        branchDropdown.innerHTML = '<div class="dropdown-item disabled">No branches available</div>';
        selectedText.textContent = 'No branches available';
        return;
    }
    
    let html = '';
    branches.forEach(branch => {
        html += `<div class="dropdown-item" data-value="${branch.branchName}" data-id="${branch.branchID}">${branch.branchName}</div>`;
    });
    
    branchDropdown.innerHTML = html;
    branchButton.disabled = false;
    selectedText.textContent = 'Select Branch';
    selectedText.classList.remove('text-gray-400');
    selectedText.classList.add('text-gray-500');
    
    console.log('✅ Branch dropdown populated with', branches.length, 'branches');
}

// Populate semester dropdown (static 1-8)
function populateSemesterDropdown() {
    const semesterDropdown = document.querySelector('[data-field="semester"]').parentNode.querySelector('.dropdown-menu');
    const semesterButton = document.querySelector('[data-field="semester"]');
    const selectedText = semesterButton.querySelector('.selected-text');
    
    let html = '';
    for (let i = 1; i <= 8; i++) {
        html += `<div class="dropdown-item" data-value="${i}" data-id="${i}">Semester ${i}</div>`;
    }
    
    semesterDropdown.innerHTML = html;
    semesterButton.disabled = false;
    selectedText.textContent = 'Select Semester';
    selectedText.classList.remove('text-gray-400');
    selectedText.classList.add('text-gray-500');
    
    console.log('✅ Semester dropdown populated');
}

// Populate subject dropdown
async function populateSubjectDropdown() {
    const subjectDropdown = document.querySelector('[data-field="subject"]').parentNode.querySelector('.dropdown-menu');
    const subjectButton = document.querySelector('[data-field="subject"]');
    const selectedText = subjectButton.querySelector('.selected-text');
    
    if (!formData.branchID || !formData.semester) {
        subjectDropdown.innerHTML = '<div class="dropdown-item disabled">Select branch and semester first</div>';
        subjectButton.disabled = true;
        selectedText.textContent = 'Select branch and semester first';
        selectedText.classList.remove('text-gray-500');
        selectedText.classList.add('text-gray-400');
        return;
    }
    
    selectedText.textContent = 'Loading subjects...';
    
    const subjects = await fetchSubjects(formData.branchID, formData.semester);
    
    if (subjects.length === 0) {
        subjectDropdown.innerHTML = '<div class="dropdown-item disabled">No subjects available</div>';
        subjectButton.disabled = true;
        selectedText.textContent = 'No subjects available';
        return;
    }
    
    let html = '';
    subjects.forEach(subject => {
        html += `<div class="dropdown-item" data-value="${subject.subjectName}" data-id="${subject.subjectID}">${subject.subjectName}</div>`;
    });
    
    subjectDropdown.innerHTML = html;
    subjectButton.disabled = false;
    selectedText.textContent = 'Select Subject';
    selectedText.classList.remove('text-gray-400');
    selectedText.classList.add('text-gray-500');
    
    console.log('✅ Subject dropdown populated with', subjects.length, 'subjects');
}

// =============================================================================
// DROPDOWN FUNCTIONALITY WITH PROPER EVENT HANDLING
// =============================================================================

function initializeDropdowns() {
    // Handle dropdown button clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-button') || e.target.closest('.dropdown-button')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.classList.contains('dropdown-button') ? e.target : e.target.closest('.dropdown-button');
            
            if (button.disabled) return;
            
            const menu = button.parentNode.querySelector('.dropdown-menu');
            const isOpen = menu.classList.contains('show');
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.dropdown-button').forEach(b => b.classList.remove('active'));
            
            if (!isOpen) {
                menu.classList.add('show');
                button.classList.add('active');
            }
        }
        
        // Handle dropdown item clicks
        if (e.target.classList.contains('dropdown-item') && !e.target.classList.contains('disabled')) {
            e.stopPropagation();
            
            const item = e.target;
            const menu = item.closest('.dropdown-menu');
            const button = menu.parentNode.querySelector('.dropdown-button');
            const field = button.getAttribute('data-field');
            const value = item.getAttribute('data-value');
            const id = item.getAttribute('data-id');
            const text = item.textContent;
            
            // Update button text
            const selectedText = button.querySelector('.selected-text');
            selectedText.textContent = text;
            selectedText.classList.remove('text-gray-500', 'text-gray-400');
            selectedText.classList.add('text-gray-900');
            
            // Update form data
            formData[field] = value;
            if (field === 'schema') {
                formData.schemaID = id;
            } else if (field === 'branch') {
                formData.branchID = id;
                resetSubjectDropdown();
                formData.subject = '';
                formData.subjectID = '';
            } else if (field === 'semester') {
                resetSubjectDropdown();
                formData.subject = '';
                formData.subjectID = '';
            } else if (field === 'subject') {
                formData.subjectID = id;
            }
            
            const formField = button.closest('.form-field');
            formField.classList.remove('error');
            
            menu.classList.remove('show');
            button.classList.remove('active');
            
            handleDropdownChange(field, value, id);
            console.log(`${field} selected:`, value, '(ID:', id, ')');
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.dropdown-button').forEach(b => b.classList.remove('active'));
        }
    });
}

function handleDropdownChange(field, value, id) {
    if (field === 'schema') {
        populateBranchDropdown();
        populateSemesterDropdown();
    } else if (field === 'branch' && formData.semester) {
        populateSubjectDropdown();
    } else if (field === 'semester' && formData.branchID) {
        populateSubjectDropdown();
    }
}

function resetSubjectDropdown() {
    const subjectDropdown = document.querySelector('[data-field="subject"]').parentNode.querySelector('.dropdown-menu');
    const subjectButton = document.querySelector('[data-field="subject"]');
    const selectedText = subjectButton.querySelector('.selected-text');
    
    subjectDropdown.innerHTML = '<div class="dropdown-item disabled">Select branch and semester first</div>';
    subjectButton.disabled = true;
    selectedText.textContent = 'Select branch and semester first';
    selectedText.classList.remove('text-gray-900', 'text-gray-500');
    selectedText.classList.add('text-gray-400');
}

// =============================================================================
// FILE UPLOAD FUNCTIONALITY
// =============================================================================

function initializeFileUpload() {
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadContent = fileUploadArea.querySelector('.upload-content');
    const selectedFileDiv = fileUploadArea.querySelector('.selected-file');
    const fileNameSpan = document.getElementById('file-name');
    const fileSizeSpan = document.getElementById('file-size');
    const removeFileBtn = document.getElementById('remove-file');
    
    fileUploadArea.addEventListener('click', () => {
        if (!selectedFileDiv.classList.contains('hidden')) return;
        fileInput.click();
    });
    
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
    
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeSelectedFile();
    });
    
    function handleFileSelection(file) {
        if (file.type !== 'application/pdf') {
            showMessage('error', 'Please select a PDF file only.');
            return;
        }
        
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            showMessage('error', 'File size must be less than 50MB.');
            return;
        }
        
        formData.file = file;
        formData.fileType = 'pdf';
        fileNameSpan.textContent = file.name;
        fileSizeSpan.textContent = formatFileSize(file.size);
        
        uploadContent.classList.add('hidden');
        selectedFileDiv.classList.remove('hidden');
        
        const formField = fileUploadArea.closest('.form-field');
        formField.classList.remove('error');
        
        console.log('File selected:', file.name, formatFileSize(file.size));
    }
    
    function removeSelectedFile() {
        formData.file = null;
        formData.fileType = '';
        fileInput.value = '';
        
        uploadContent.classList.remove('hidden');
        selectedFileDiv.classList.add('hidden');
        
        console.log('File removed');
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// =============================================================================
// FORM VALIDATION
// =============================================================================

function validateForm() {
    let isValid = true;
    const errors = {};
    
    Object.keys(validationRules).forEach(field => {
        const rule = validationRules[field];
        const value = formData[field];
        
        if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            errors[field] = rule.message;
            isValid = false;
        }
    });
    
    updateValidationUI(errors);
    return isValid;
}

function updateValidationUI(errors) {
    document.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('error');
    });
    
    Object.keys(errors).forEach(field => {
        const formField = getFormField(field);
        if (formField) {
            formField.classList.add('error');
            const errorText = formField.querySelector('.error-text');
            if (errorText) {
                errorText.textContent = errors[field];
            }
        }
    });
}

function getFormField(field) {
    if (field === 'title') {
        return document.getElementById('title').closest('.form-field');
    } else if (field === 'description') {
        return document.getElementById('description').closest('.form-field');
    } else if (field === 'file') {
        return document.getElementById('file-upload-area').closest('.form-field');
    } else {
        return document.querySelector(`[data-field="${field}"]`).closest('.form-field');
    }
}

// =============================================================================
// FORM SUBMISSION WITH PROPER API INTEGRATION
// =============================================================================

function initializeFormSubmission() {
    const form = document.getElementById('upload-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingDiv = submitBtn.querySelector('.loading');
    const titleInput = document.getElementById('title');
    const descriptionTextarea = document.getElementById('description');
    
    // Handle title input
    titleInput.addEventListener('input', (e) => {
        formData.title = e.target.value.trim();
        
        const formField = e.target.closest('.form-field');
        if (formData.title) {
            formField.classList.remove('error');
        }
    });
    
    // Handle description input
    descriptionTextarea.addEventListener('input', (e) => {
        formData.description = e.target.value.trim();
        
        const formField = e.target.closest('.form-field');
        if (formData.description) {
            formField.classList.remove('error');
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        hideMessages();
        
        if (!validateForm()) {
            showMessage('error', 'Please fill in all required fields correctly.');
            return;
        }
        
        const userId = getUserIdFromCookie();
        if (!userId) {
            showMessage('error', 'User authentication required. Please log in again.');
            return;
        }
        
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        loadingDiv.classList.add('show');
        
        try {
            // Prepare FormData with correct API parameters
            const uploadFormData = new FormData();
            uploadFormData.append('user_id', userId);
            uploadFormData.append('schema_id', formData.schemaID);
            uploadFormData.append('branch_id', formData.branchID);
            uploadFormData.append('subject_id', formData.subjectID);
            uploadFormData.append('sem', formData.semester);
            uploadFormData.append('title', formData.title);
            uploadFormData.append('file_type', formData.fileType);
            uploadFormData.append('file', formData.file);
            
            console.log('Submitting upload with data:', {
                user_id: userId,
                schema_id: formData.schemaID,
                branch_id: formData.branchID,
                subject_id: formData.subjectID,
                sem: formData.semester,
                title: formData.title,
                file_type: formData.fileType,
                fileName: formData.file.name,
                fileSize: formData.file.size
            });
            
            // Submit to correct API endpoint
            const response = await fetch('/api/upload', {
                method: 'POST',
                credentials: 'include',
                body: uploadFormData
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Upload successful:', result);
                
                showMessage('success', 'Document uploaded successfully! Thank you for contributing to Stucon.');
                
                setTimeout(() => {
                    resetForm();
                }, 3000);
                
            } else {
                const error = await response.json().catch(() => ({ message: 'Upload failed' }));
                console.error('❌ Upload failed:', error);
                showMessage('error', error.message || 'Upload failed. Please try again.');
            }
            
        } catch (error) {
            console.error('❌ Network error during upload:', error);
            showMessage('error', 'Network error. Please check your connection and try again.');
        } finally {
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            loadingDiv.classList.remove('show');
        }
    });
}

function resetForm() {
    Object.keys(formData).forEach(key => {
        if (key === 'file') {
            formData[key] = null;
        } else if (key === 'fileType') {
            formData[key] = 'pdf';
        } else {
            formData[key] = '';
        }
    });
    
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    
    document.querySelectorAll('.dropdown-button .selected-text').forEach(text => {
        const button = text.closest('.dropdown-button');
        const field = button.getAttribute('data-field');
        
        if (field === 'schema') {
            text.textContent = 'Select Schema';
        } else {
            text.textContent = `Select ${field.charAt(0).toUpperCase() + field.slice(1)}`;
            button.disabled = true;
        }
        
        text.classList.remove('text-gray-900');
        text.classList.add(field === 'schema' ? 'text-gray-500' : 'text-gray-400');
    });
    
    document.getElementById('file-input').value = '';
    document.querySelector('.upload-content').classList.remove('hidden');
    document.querySelector('.selected-file').classList.add('hidden');
    
    document.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('error');
    });
    
    console.log('Form reset successfully');
}

// =============================================================================
// MESSAGE HANDLING & NAVIGATION
// =============================================================================

function showMessage(type, text) {
    hideMessages();
    
    const messageId = type === 'success' ? 'success-message' : 'error-message';
    const textId = type === 'success' ? 'success-text' : 'error-text';
    
    const messageDiv = document.getElementById(messageId);
    const textSpan = document.getElementById(textId);
    
    textSpan.textContent = text;
    messageDiv.classList.add('show');
    
    if (type === 'success') {
        setTimeout(() => {
            hideMessages();
        }, 5000);
    }
}

function hideMessages() {
    document.getElementById('success-message').classList.remove('show');
    document.getElementById('error-message').classList.remove('show');
}

function goBack() {
    window.history.back();
    
    setTimeout(() => {
        window.location.href = '../mainPage/mainPage.html';
    }, 100);
}

window.goBack = goBack;

// =============================================================================
// ✅ INITIALIZATION WITH AUTHENTICATION INTEGRATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📤 Upload page initialized with authentication');
    
    // ✅ Check authentication first (same as mainPage)
    const isAuthenticated = await checkAuthenticationAndRedirect();
    if (!isAuthenticated) {
        return; // Stop execution if not authenticated
    }
    
    // ✅ Update user display (same as mainPage)
    updateUserDisplay();
    
    // ✅ Start session monitoring (same as mainPage)
    startSessionMonitoring();
    
    // ✅ Initialize logout button (same as mainPage)
    initializeLogoutButton();
    
    // Initialize existing components
    initializeDropdowns();
    initializeFileUpload();
    initializeFormSubmission();
    
    // Initialize API-driven dropdowns
    await populateSchemaDropdown();
    
    console.log('✅ Upload page ready with authentication and user info');
});

console.log('✅ Stucon Upload Page - Ready with authentication integration!');
