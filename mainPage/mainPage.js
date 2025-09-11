// CS Engineering focused dummy data with IDs matching titlePage
const dummyData = [
    {
        id: 1,
        title: "Mathematics I - Complete Notes",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Mathematics",
        year: "1st Year",
        desc: "Comprehensive calculus and linear algebra notes for first year engineering students.",
        icon: "📐"
    },
    {
        id: 2,
        title: "Physics for Engineers Handbook",
        scheme: "2022",
        branch: "Electronics",
        subject: "Physics",
        year: "1st Year",
        desc: "Applied physics concepts with engineering applications and laboratory experiments.",
        icon: "⚗️"
    },
    {
        id: 3,
        title: "Programming in C - Lab Manual",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Programming",
        year: "1st Year",
        desc: "Complete C programming tutorial with practical exercises and projects.",
        icon: "💻"
    },
    {
        id: 4,
        title: "Data Structures and Algorithms",
        scheme: "2022",
        branch: "Computer Science",
        subject: "Data Structures",
        year: "2nd Year",
        desc: "Comprehensive guide to data structures implementation and algorithm analysis.",
        icon: "🔗"
    },
    {
        id: 5,
        title: "Database Management Systems",
        scheme: "2020",
        branch: "Computer Science",
        subject: "DBMS",
        year: "3rd Year",
        desc: "Complete DBMS concepts covering SQL, normalization, and database design.",
        icon: "🗄️"
    },
    // Add more data as needed...
];

// DOM elements
const contentDiv = document.getElementById("content");
const clearBtn = document.getElementById("clearFilters");
const resultsTitle = document.getElementById("results-title");
const noResults = document.getElementById("no-results");
const filterCount = document.getElementById("filter-count");

// Filter state
const filters = {
    scheme: "All",
    branch: "All", 
    subject: "All",
    year: "All"
};

// Render cards function
function renderCards() {
    contentDiv.innerHTML = "";
    
    // Filter the data
    const filtered = dummyData.filter(item => {
        return (filters.scheme === "All" || item.scheme === filters.scheme) &&
               (filters.branch === "All" || item.branch === filters.branch) &&
               (filters.subject === "All" || item.subject === filters.subject) &&
               (filters.year === "All" || item.year === filters.year);
    });

    // Update results title
    resultsTitle.textContent = `${filtered.length === dummyData.length ? 'All Documents' : 'Filtered Documents'} (${filtered.length})`;
    
    // Update filter count
    const activeFilters = Object.values(filters).filter(f => f !== "All").length;
    filterCount.textContent = activeFilters > 0 ? `${activeFilters} filter(s) active` : "";

    // Show/hide no results
    if (filtered.length === 0) {
        contentDiv.classList.add("hidden");
        noResults.classList.remove("hidden");
        return;
    } else {
        contentDiv.classList.remove("hidden");
        noResults.classList.add("hidden");
    }

    // Create cards
    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "card bg-white shadow-md rounded-lg p-6 hover:shadow-lg border border-gray-200 cursor-pointer";
        
        const yearColors = {
            "1st Year": "bg-green-100 text-green-800",
            "2nd Year": "bg-blue-100 text-blue-800", 
            "3rd Year": "bg-yellow-100 text-yellow-800",
            "4th Year": "bg-red-100 text-red-800"
        };

        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="text-3xl">${item.icon}</div>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${yearColors[item.year]}">${item.year}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>
            <p class="text-gray-600 text-sm mb-4">${item.desc}</p>
            <div class="flex flex-wrap gap-2 mb-4 text-xs">
                <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded">Scheme ${item.scheme}</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded">${item.branch}</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded">${item.subject}</span>
            </div>
            <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center w-full justify-center">
                View Document 
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        `;
        
        card.addEventListener('click', () => {
            console.log(`Opening document: ${item.title} (ID: ${item.id})`);
            window.location.href = `../titlePage/titlePage.html?id=${item.id}`;
        });
        
        contentDiv.appendChild(card);
    });
}

// Update filter indicators
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
// DROPDOWN EVENT HANDLERS - Fixed for your HTML structure
// =============================================================================

// 1. Button click handlers
document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.stopPropagation();
        
        const dropdown = tab.nextElementSibling;
        const isOpen = dropdown.classList.contains("show");
        
        // Close all dropdowns
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
        
        // Toggle current dropdown  
        if (!isOpen) {
            dropdown.classList.add("show");
        }
    });
});

// 2. Dropdown option selection - Fixed for <li> elements
document.querySelectorAll(".dropdown").forEach(dropdown => {
    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Check if clicked element is an <li> with data-value
        if (e.target.tagName === 'LI' && e.target.hasAttribute('data-value')) {
            const value = e.target.getAttribute('data-value');
            const filterType = dropdown.getAttribute('data-filter');
            const button = dropdown.previousElementSibling;
            
            // Update filter state
            filters[filterType] = value;
            
            // Update button text while preserving indicator
            const indicator = button.querySelector('.filter-indicator');
            if (value === 'All') {
                button.textContent = filterType.charAt(0).toUpperCase() + filterType.slice(1);
            } else {
                button.textContent = e.target.textContent;
            }
            if (indicator) button.appendChild(indicator);
            
            // Update selected state in dropdown
            dropdown.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            e.target.classList.add('selected');
            
            // Close dropdown
            dropdown.classList.remove('show');
            
            // Re-render cards
            renderCards();
            updateFilterIndicators();
            
            console.log(`Filter applied: ${filterType} = ${value}`);
        }
    });
});

// 3. Close dropdowns on outside click
document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    }
});

// 4. Clear filters button
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        // Reset filters
        for (let key in filters) {
            filters[key] = "All";
        }
        
        // Reset button texts
        document.querySelectorAll('.nav-tab').forEach(tab => {
            const filterType = tab.getAttribute('data-filter');
            const indicator = tab.querySelector('.filter-indicator');
            tab.textContent = filterType.charAt(0).toUpperCase() + filterType.slice(1);
            if (indicator) tab.appendChild(indicator);
        });
        
        // Reset selected states in dropdowns
        document.querySelectorAll(".dropdown li").forEach(li => {
            li.classList.remove('selected');
            if (li.dataset.value === "All") {
                li.classList.add('selected');
            }
        });
        
        // Re-render
        renderCards();
        updateFilterIndicators();
        
        console.log("All filters cleared");
    });
}

// 5. Keyboard support
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 SJC Grove Main Page initialized');
    renderCards();
    console.log('✅ Main page ready with dropdown navigation!');
});

console.log("✅ SJC Grove Main Page - Ready with titlePage.html navigation!");
