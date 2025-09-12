// =============================================================================
// RECEIVE AND APPLY FILTER DATA - NEW SECTION
// =============================================================================

// Function to get URL parameters
function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id'),
        scheme: urlParams.get('scheme'),
        branch: urlParams.get('branch'),
        semester: urlParams.get('semester'),
        subject: urlParams.get('subject')
    };
}

// Function to get filter values from sessionStorage as fallback
function getStoredFilterValues() {
    const stored = sessionStorage.getItem('documentFilters');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.warn('Failed to parse stored filter values');
            return null;
        }
    }
    return null;
}

// Function to update document info table
function updateDocumentInfoTable(filterValues) {
    console.log('Updating document info table with:', filterValues);
    
    // Update table cells
    const schemeCell = document.getElementById('table-scheme');
    const branchCell = document.getElementById('table-branch');
    const semesterCell = document.getElementById('table-semester');
    const subjectCell = document.getElementById('table-subject');
    
    if (schemeCell) {
        schemeCell.textContent = filterValues.scheme ? `${filterValues.scheme} Scheme` : 'All Schemes';
    }
    
    if (branchCell) {
        branchCell.textContent = filterValues.branch || 'All Branches';
    }
    
    if (semesterCell) {
        semesterCell.textContent = filterValues.semester ? `Semester ${filterValues.semester}` : 'All Semesters';
    }
    
    if (subjectCell) {
        subjectCell.textContent = filterValues.subject || 'All Subjects';
    }
}

// =============================================================================
// EXISTING CODE WITH UPDATES
// =============================================================================

// Dummy document dataset
const documentDatabase = [
    {
        id: 1,
        title: "Mathematics I - Complete Notes",
        scheme: "2024",
        branch: "Computer Science Engineering",
        semester: "1st Semester",
        year: "1st Year",
        publisher: "StuconPublications",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        likes: 45,
        dislikes: 3
    },
    {
        id: 2,
        title: "Physics for Engineers Handbook",
        scheme: "2022",
        branch: "Electronics & Communication",
        semester: "1st Semester", 
        year: "1st Year",
        publisher: "Academic Press",
        fileUrl: "https://www.africau.edu/images/default/sample.pdf",
        likes: 32,
        dislikes: 7
    },
    {
        id: 3,
        title: "Programming in C - Lab Manual",
        scheme: "2024",
        branch: "Computer Science Engineering",
        semester: "2nd Semester",
        year: "1st Year", 
        publisher: "Tech Books Ltd",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        likes: 67,
        dislikes: 12
    },
    {
        id: 4,
        title: "Data Structures and Algorithms",
        scheme: "2022",
        branch: "Computer Science Engineering",
        semester: "3rd Semester",
        year: "2nd Year",
        publisher: "Engineering Publications",
        fileUrl: "https://www.africau.edu/images/default/sample.pdf",
        likes: 89,
        dislikes: 5
    },
    {
        id: 5,
        title: "Database Management Systems",
        scheme: "2020",
        branch: "Computer Science Engineering", 
        semester: "5th Semester",
        year: "3rd Year",
        publisher: "Academic Excellence",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        likes: 154,
        dislikes: 18
    }
];

// Global variables
let currentDocument = null;
let userLikeState = null;
let currentFilterValues = null; // NEW: Store filter values

// Initialize the page when DOM is loaded - UPDATED
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Title page viewer initialized');
    
    // ✅ GET FILTER VALUES FROM URL OR SESSION
    const urlParams = getURLParameters();
    const storedFilters = getStoredFilterValues();
    
    // Combine URL params with stored filters (URL takes precedence)
    currentFilterValues = {
        scheme: urlParams.scheme || storedFilters?.scheme || null,
        branch: urlParams.branch || storedFilters?.branch || null,
        semester: urlParams.semester || storedFilters?.semester || null,
        subject: urlParams.subject || storedFilters?.subject || null
    };
    
    console.log('Received filter values:', currentFilterValues);
    
    // ✅ UPDATE DOCUMENT INFO TABLE
    updateDocumentInfoTable(currentFilterValues);
    
    // Get document ID and load document
    const documentId = parseInt(urlParams.id);
    console.log('Requested document ID:', documentId);
    
    if (documentId) {
        loadDocument(documentId);
    } else {
        showError('No document ID provided');
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Load document data by ID
function loadDocument(id) {
    // Show loading state
    showLoading();
    
    // Simulate API delay
    setTimeout(() => {
        // Find document in database
        currentDocument = documentDatabase.find(doc => doc.id === id);
        
        if (currentDocument) {
            displayDocument(currentDocument);
            console.log('Document loaded successfully:', currentDocument.title);
        } else {
            showError('Document not found');
            console.error('Document with ID', id, 'not found');
        }
    }, 800); // Simulate network delay
}

// Display document information - UPDATED
function displayDocument(document) {
    // Hide loading and error states
    hideLoading();
    hideError();
    
    // Show document content
    const documentContent = document.getElementById('document-content');
    if (documentContent) {
        documentContent.classList.remove('hidden');
    }
    
    // Update document title in the card
    const titleElement = document.getElementById('document-title');
    if (titleElement) {
        titleElement.textContent = document.title;
    }
    
    // Populate document information (if using old HTML structure)
    const docTitle = document.getElementById('doc-title');
    const docScheme = document.getElementById('doc-scheme');
    const docBranch = document.getElementById('doc-branch');
    const docSemester = document.getElementById('doc-semester');
    const docYear = document.getElementById('doc-year');
    const docPublisher = document.getElementById('doc-publisher');
    
    if (docTitle) docTitle.textContent = document.title;
    if (docScheme) docScheme.textContent = `Scheme ${document.scheme}`;
    if (docBranch) docBranch.textContent = document.branch;
    if (docSemester) docSemester.textContent = document.semester;
    if (docYear) docYear.textContent = document.year;
    if (docPublisher) docPublisher.textContent = document.publisher;
    
    // Update like/dislike counts
    const likeCount = document.getElementById('like-count');
    const dislikeCount = document.getElementById('dislike-count');
    if (likeCount) likeCount.textContent = document.likes;
    if (dislikeCount) dislikeCount.textContent = document.dislikes;
    
    // Load PDF in viewer
    const pdfViewer = document.getElementById('pdf-viewer');
    const fallbackLink = document.getElementById('fallback-link');
    
    if (pdfViewer) pdfViewer.src = document.fileUrl;
    if (fallbackLink) fallbackLink.href = document.fileUrl;
    
    // Update page title
    document.title = `${document.title} - StuconGrove`;
    
    console.log('✅ Document display complete with filter context');
}

// Setup event listeners
function setupEventListeners() {
    // Like button
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            handleLike();
        });
    }
    
    // Dislike button
    const dislikeBtn = document.getElementById('dislike-btn');
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function() {
            handleDislike();
        });
    }
    
    // Download button
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            handleDownload();
        });
    }
    
    console.log('Event listeners setup complete');
}

// Handle like button click
function handleLike() {
    if (!currentDocument) return;
    
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCount = document.getElementById('like-count');
    const dislikeCount = document.getElementById('dislike-count');
    
    if (userLikeState === 'like') {
        // User is removing their like
        userLikeState = null;
        if (likeBtn) likeBtn.classList.remove('active');
        currentDocument.likes--;
        console.log('👍 Like removed for:', currentDocument.title);
    } else {
        // User is liking (remove dislike if exists)
        if (userLikeState === 'dislike') {
            if (dislikeBtn) dislikeBtn.classList.remove('active');
            currentDocument.dislikes--;
        }
        
        userLikeState = 'like';
        if (likeBtn) likeBtn.classList.add('active');
        if (dislikeBtn) dislikeBtn.classList.remove('active');
        currentDocument.likes++;
        console.log('👍 Document liked:', currentDocument.title);
    }
    
    // Update counts
    if (likeCount) likeCount.textContent = currentDocument.likes;
    if (dislikeCount) dislikeCount.textContent = currentDocument.dislikes;
}

// Handle dislike button click
function handleDislike() {
    if (!currentDocument) return;
    
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCount = document.getElementById('like-count');
    const dislikeCount = document.getElementById('dislike-count');
    
    if (userLikeState === 'dislike') {
        // User is removing their dislike
        userLikeState = null;
        if (dislikeBtn) dislikeBtn.classList.remove('active');
        currentDocument.dislikes--;
        console.log('👎 Dislike removed for:', currentDocument.title);
    } else {
        // User is disliking (remove like if exists)
        if (userLikeState === 'like') {
            if (likeBtn) likeBtn.classList.remove('active');
            currentDocument.likes--;
        }
        
        userLikeState = 'dislike';
        if (dislikeBtn) dislikeBtn.classList.add('active');
        if (likeBtn) likeBtn.classList.remove('active');
        currentDocument.dislikes++;
        console.log('👎 Document disliked:', currentDocument.title);
    }
    
    // Update counts
    if (likeCount) likeCount.textContent = currentDocument.likes;
    if (dislikeCount) dislikeCount.textContent = currentDocument.dislikes;
}

// Handle download button click
function handleDownload() {
    if (!currentDocument) return;
    
    console.log('📥 Download initiated for:', currentDocument.title);
    
    // Create a temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = currentDocument.fileUrl;
    downloadLink.download = `${currentDocument.title}.pdf`;
    downloadLink.target = '_blank';
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Show feedback
    showDownloadFeedback();
}

// Show download feedback
function showDownloadFeedback() {
    const downloadBtn = document.getElementById('download-btn');
    if (!downloadBtn) return;
    
    const originalContent = downloadBtn.innerHTML;
    
    downloadBtn.innerHTML = `
        <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <span>Downloading...</span>
    `;
    
    setTimeout(() => {
        downloadBtn.innerHTML = originalContent;
    }, 2000);
}

// Show loading state
function showLoading() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const documentContent = document.getElementById('document-content');
    
    if (loadingState) loadingState.classList.remove('hidden');
    if (errorState) errorState.classList.add('hidden');
    if (documentContent) documentContent.classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) loadingState.classList.add('hidden');
}

// Show error state
function showError(message) {
    hideLoading();
    const errorState = document.getElementById('error-state');
    const documentContent = document.getElementById('document-content');
    
    if (errorState) errorState.classList.remove('hidden');
    if (documentContent) documentContent.classList.add('hidden');
    
    console.error('Error:', message);
}

// Hide error state
function hideError() {
    const errorState = document.getElementById('error-state');
    if (errorState) errorState.classList.add('hidden');
}

// Go back to main page - UPDATED to preserve filters
function goBack() {
    // Try to go back in history first
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Fallback: redirect to main page with current filters
        let mainPageURL = '../src/pages/main/mainPage.html';
        
        if (currentFilterValues) {
            const params = new URLSearchParams();
            Object.entries(currentFilterValues).forEach(([key, value]) => {
                if (value && value !== 'All') {
                    params.append(key, value);
                }
            });
            
            if (params.toString()) {
                mainPageURL += `?${params.toString()}`;
            }
        }
        
        window.location.href = mainPageURL;
    }
}

// Make goBack function globally available
window.goBack = goBack;

console.log('✅ Title page viewer script loaded with filter support');
