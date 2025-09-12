// =============================================================================
// API INTEGRATION FOR DYNAMIC DROPDOWNS
// =============================================================================

// API Cache to avoid repeated calls
const apiCache = {
    schemas: null,
    branches: null,
    subjects: {}
};

// Form state with IDs for API calls
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
    fileType: 'pdf' // Default for PDF files
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
// API FUNCTIONS
// =============================================================================

// ✅ Fetch schemas from API
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

// ✅ Fetch branches from API
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

// ✅ Fetch subjects from API
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

// ✅ Get user ID from cookies
function getUserIdFromCookie() {
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

// ✅ Populate schema dropdown
async function populateSchemaDropdown() {
    const schemaDropdown = document.querySelector('[data-field="schema"]').parentNode.querySelector('.dropdown-menu');
    const schemaButton = document.querySelector('[data-field="schema"]');
    const selectedText = schemaButton.querySelector('.selected-text');
    
    // Show loading
    selectedText.textContent = 'Loading schemas...';
    selectedText.classList.remove('text-gray-500');
    selectedText.classList.add('text-gray-400');
    
    const schemas = await fetchSchemas();
    
    if (schemas.length === 0) {
        schemaDropdown.innerHTML = '<div class="dropdown-item disabled">No schemas available</div>';
        selectedText.textContent = 'No schemas available';
        return;
    }
    
    // Build dropdown HTML
    let html = '';
    schemas.forEach(schema => {
        html += `<div class="dropdown-item" data-value="${schema}" data-id="${schema}">${schema}</div>`;
    });
    
    schemaDropdown.innerHTML = html;
    
    // Enable schema button
    schemaButton.disabled = false;
    selectedText.textContent = 'Select Schema';
    selectedText.classList.remove('text-gray-400');
    selectedText.classList.add('text-gray-500');
    
    console.log('✅ Schema dropdown populated with', schemas.length, 'schemas');
}

// ✅ Populate branch dropdown
async function populateBranchDropdown() {
    const branchDropdown = document.querySelector('[data-field="branch"]').parentNode.querySelector('.dropdown-menu');
    const branchButton = document.querySelector('[data-field="branch"]');
    const selectedText = branchButton.querySelector('.selected-text');
    
    // Show loading
    selectedText.textContent = 'Loading branches...';
    
    const branches = await fetchBranches();
    
    if (branches.length === 0) {
        branchDropdown.innerHTML = '<div class="dropdown-item disabled">No branches available</div>';
        selectedText.textContent = 'No branches available';
        return;
    }
    
    // Build dropdown HTML
    let html = '';
    branches.forEach(branch => {
        html += `<div class="dropdown-item" data-value="${branch.branchName}" data-id="${branch.branchID}">${branch.branchName}</div>`;
    });
    
    branchDropdown.innerHTML = html;
    
    // Enable branch button
    branchButton.disabled = false;
    selectedText.textContent = 'Select Branch';
    selectedText.classList.remove('text-gray-400');
    selectedText.classList.add('text-gray-500');
    
    console.log('✅ Branch dropdown populated with', branches.length, 'branches');
}

// ✅ Populate semester dropdown (static semesters 1-8)
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

// ✅ Populate subject dropdown
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
    
    // Show loading
    selectedText.textContent = 'Loading subjects...';
    
    const subjects = await fetchSubjects(formData.branchID, formData.semester);
    
    if (subjects.length === 0) {
        subjectDropdown.innerHTML = '<div class="dropdown-item disabled">No subjects available</div>';
        subjectButton.disabled = true;
        selectedText.textContent = 'No subjects available';
        return;
    }
    
    // Build dropdown HTML
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
// DROPDOWN FUNCTIONALITY
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
            
            // Open current dropdown
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
                // Reset dependent dropdowns
                resetSubjectDropdown();
                formData.subject = '';
                formData.subjectID = '';
            } else if (field === 'semester') {
                // Reset subject dropdown
                resetSubjectDropdown();
                formData.subject = '';
                formData.subjectID = '';
            } else if (field === 'subject') {
                formData.subjectID = id;
            }
            
            // Clear validation error
            const formField = button.closest('.form-field');
            formField.classList.remove('error');
            
            // Close dropdown
            menu.classList.remove('show');
            button.classList.remove('active');
            
            // Handle cascading updates
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
    // Handle cascading updates
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
    
    // Handle click to upload
    fileUploadArea.addEventListener('click', () => {
        if (!selectedFileDiv.classList.contains('hidden')) return;
        fileInput.click();
    });
    
    // Handle drag and drop
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
    
    // Handle file input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
    
    // Handle file removal
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeSelectedFile();
    });
    
    function handleFileSelection(file) {
        // Validate file type
        if (file.type !== 'application/pdf') {
            showMessage('error', 'Please select a PDF file only.');
            return;
        }
        
        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
            showMessage('error', 'File size must be less than 50MB.');
            return;
        }
        
        // Update UI
        formData.file = file;
        formData.fileType = 'pdf'; // Set file type
        fileNameSpan.textContent = file.name;
        fileSizeSpan.textContent = formatFileSize(file.size);
        
        uploadContent.classList.add('hidden');
        selectedFileDiv.classList.remove('hidden');
        
        // Clear validation error
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
    
    // Validate each field
    Object.keys(validationRules).forEach(field => {
        const rule = validationRules[field];
        const value = formData[field];
        
        if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            errors[field] = rule.message;
            isValid = false;
        }
    });
    
    // Update UI with validation errors
    updateValidationUI(errors);
    
    return isValid;
}

function updateValidationUI(errors) {
    // Clear all existing errors
    document.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('error');
    });
    
    // Show new errors
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
// FORM SUBMISSION WITH API INTEGRATION
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
        
        // Clear validation error
        const formField = e.target.closest('.form-field');
        if (formData.title) {
            formField.classList.remove('error');
        }
    });
    
    // Handle description input
    descriptionTextarea.addEventListener('input', (e) => {
        formData.description = e.target.value.trim();
        
        // Clear validation error
        const formField = e.target.closest('.form-field');
        if (formData.description) {
            formField.classList.remove('error');
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide any existing messages
        hideMessages();
        
        // Validate form
        if (!validateForm()) {
            showMessage('error', 'Please fill in all required fields correctly.');
            return;
        }
        
        // Get user ID from cookies
        const userId = getUserIdFromCookie();
        if (!userId) {
            showMessage('error', 'User authentication required. Please log in again.');
            return;
        }
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        loadingDiv.classList.add('show');
        
        try {
            // ✅ Prepare FormData for API upload
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
            
            // ✅ Submit to backend API
            const response = await fetch('/api/upload', {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                body: uploadFormData
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Upload successful:', result);
                
                showMessage('success', 'Document uploaded successfully! Thank you for contributing to Stucon.');
                
                // Reset form after successful upload
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
            // Re-enable submit button and hide loading
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            loadingDiv.classList.remove('show');
        }
    });
}

function resetForm() {
    // Reset form data
    Object.keys(formData).forEach(key => {
        if (key === 'file') {
            formData[key] = null;
        } else if (key === 'fileType') {
            formData[key] = 'pdf';
        } else {
            formData[key] = '';
        }
    });
    
    // Reset input fields
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    
    // Reset dropdowns
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
    
    // Reset file upload
    document.getElementById('file-input').value = '';
    document.querySelector('.upload-content').classList.remove('hidden');
    document.querySelector('.selected-file').classList.add('hidden');
    
    // Clear validation errors
    document.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('error');
    });
    
    console.log('Form reset successfully');
}

// =============================================================================
// MESSAGE HANDLING
// =============================================================================

function showMessage(type, text) {
    hideMessages();
    
    const messageId = type === 'success' ? 'success-message' : 'error-message';
    const textId = type === 'success' ? 'success-text' : 'error-text';
    
    const messageDiv = document.getElementById(messageId);
    const textSpan = document.getElementById(textId);
    
    textSpan.textContent = text;
    messageDiv.classList.add('show');
    
    // Auto-hide success messages after 5 seconds
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

// =============================================================================
// NAVIGATION
// =============================================================================

function goBack() {
    window.history.back();
    
    // Fallback if history is empty
    setTimeout(() => {
        window.location.href = '../mainPage/mainPage.html';
    }, 100);
}

// Make goBack function globally available
window.goBack = goBack;

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📤 Upload page initialized with API integration');
    
    // Initialize all components
    initializeDropdowns();
    initializeFileUpload();
    initializeFormSubmission();
    
    // ✅ Initialize API-driven dropdowns
    await populateSchemaDropdown();
    
    console.log('✅ Upload page ready with API integration');
});

console.log('✅ Stucon Upload Page - Ready with API integration!');
