// Dummy document dataset
const documentDatabase = [
    {
        id: 1,
        title: "Mathematics I - Complete Notes",
        scheme: "2024",
        branch: "Computer Science Engineering",
        semester: "1st Semester",
        year: "1st Year",
        publisher: "SJC Publications",
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
let userLikeState = null; // null = no action, 'like' = liked, 'dislike' = disliked

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Title page viewer initialized');
    
    // Get document ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = parseInt(urlParams.get('id'));
    
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

// Display document information
function displayDocument(document) {
    // Hide loading and error states
    hideLoading();
    hideError();
    
    // Show document content
    document.getElementById('document-content').classList.remove('hidden');
    
    // Populate document information
    document.getElementById('doc-title').textContent = document.title;
    document.getElementById('doc-scheme').textContent = `Scheme ${document.scheme}`;
    document.getElementById('doc-branch').textContent = document.branch;
    document.getElementById('doc-semester').textContent = document.semester;
    document.getElementById('doc-year').textContent = document.year;
    document.getElementById('doc-publisher').textContent = document.publisher;
    
    // Update like/dislike counts
    document.getElementById('like-count').textContent = document.likes;
    document.getElementById('dislike-count').textContent = document.dislikes;
    
    // Load PDF in viewer
    const pdfViewer = document.getElementById('pdf-viewer');
    const fallbackLink = document.getElementById('fallback-link');
    
    pdfViewer.src = document.fileUrl;
    fallbackLink.href = document.fileUrl;
    
    // Update page title
    document.title = `${document.title} - SJC Grove`;
    
    console.log('✅ Document display complete');
}

// Setup event listeners
function setupEventListeners() {
    // Like button
    document.getElementById('like-btn').addEventListener('click', function() {
        handleLike();
    });
    
    // Dislike button  
    document.getElementById('dislike-btn').addEventListener('click', function() {
        handleDislike();
    });
    
    // Download button
    document.getElementById('download-btn').addEventListener('click', function() {
        handleDownload();
    });
    
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
        likeBtn.classList.remove('active');
        currentDocument.likes--;
        console.log('👍 Like removed for:', currentDocument.title);
    } else {
        // User is liking (remove dislike if exists)
        if (userLikeState === 'dislike') {
            dislikeBtn.classList.remove('active');
            currentDocument.dislikes--;
        }
        
        userLikeState = 'like';
        likeBtn.classList.add('active');
        dislikeBtn.classList.remove('active');
        currentDocument.likes++;
        console.log('👍 Document liked:', currentDocument.title);
    }
    
    // Update counts
    likeCount.textContent = currentDocument.likes;
    dislikeCount.textContent = currentDocument.dislikes;
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
        dislikeBtn.classList.remove('active');
        currentDocument.dislikes--;
        console.log('👎 Dislike removed for:', currentDocument.title);
    } else {
        // User is disliking (remove like if exists)
        if (userLikeState === 'like') {
            likeBtn.classList.remove('active');
            currentDocument.likes--;
        }
        
        userLikeState = 'dislike';
        dislikeBtn.classList.add('active');
        likeBtn.classList.remove('active');
        currentDocument.dislikes++;
        console.log('👎 Document disliked:', currentDocument.title);
    }
    
    // Update counts
    likeCount.textContent = currentDocument.likes;
    dislikeCount.textContent = currentDocument.dislikes;
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
    document.getElementById('loading-state').classList.remove('hidden');
    document.getElementById('error-state').classList.add('hidden');
    document.getElementById('document-content').classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading-state').classList.add('hidden');
}

// Show error state
function showError(message) {
    hideLoading();
    document.getElementById('error-state').classList.remove('hidden');
    document.getElementById('document-content').classList.add('hidden');
    
    console.error('Error:', message);
}

// Hide error state
function hideError() {
    document.getElementById('error-state').classList.add('hidden');
}

// Go back to main page
function goBack() {
    window.history.back();
    
    // Fallback if history is empty
    setTimeout(() => {
        window.location.href = 'mainPage.html';
    }, 100);
}

// Make goBack function globally available
window.goBack = goBack;

console.log('✅ Title page viewer script loaded successfully');
