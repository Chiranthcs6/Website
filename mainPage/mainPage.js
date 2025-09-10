// CS Engineering focused dummy data
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
  {
    id: 6,
    title: "Computer Networks Fundamentals",
    scheme: "2024",
    branch: "Computer Science",
    subject: "Networks",
    year: "3rd Year",
    desc: "Network protocols, OSI model, TCP/IP, and network security essentials.",
    icon: "🌐"
  },
  {
    id: 7,
    title: "Software Engineering Principles",
    scheme: "2022",
    branch: "Computer Science",
    subject: "Software Engineering",
    year: "4th Year",
    desc: "Software development lifecycle, testing, and project management methodologies.",
    icon: "🔧"
  },
  {
    id: 8,
    title: "Operating Systems Concepts",
    scheme: "2020",
    branch: "Computer Science",
    subject: "Operating Systems",
    year: "3rd Year",
    desc: "Process management, memory allocation, file systems, and system calls.",
    icon: "⚙️"
  },
  {
    id: 9,
    title: "Digital Electronics Lab",
    scheme: "2024",
    branch: "Electronics",
    subject: "Digital Electronics",
    year: "2nd Year",
    desc: "Logic gates, flip-flops, counters, and digital circuit design experiments.",
    icon: "🔌"
  },
  {
    id: 10,
    title: "Engineering Mechanics",
    scheme: "2022",
    branch: "Mechanical",
    subject: "Mechanics",
    year: "2nd Year",
    desc: "Statics, dynamics, and strength of materials for mechanical engineers.",
    icon: "🔩"
  },
  {
    id: 11,
    title: "Structural Analysis",
    scheme: "2020",
    branch: "Civil",
    subject: "Structures",
    year: "3rd Year",
    desc: "Analysis of beams, trusses, and frames using classical methods.",
    icon: "🏗️"
  },
  {
    id: 12,
    title: "Electrical Circuits",
    scheme: "2024",
    branch: "Electrical",
    subject: "Circuits",
    year: "2nd Year",
    desc: "AC/DC circuit analysis, network theorems, and electrical measurements.",
    icon: "⚡"
  }
];

// DOM elements
const contentDiv = document.getElementById("content");
const clearBtn = document.getElementById("clearFilters");
const resultsTitle = document.getElementById("results-title");
const noResults = document.getElementById("no-results");
const filterCount = document.getElementById("filter-count");

// Updated filter state for CS Engineering
const filters = {
  scheme: "All",
  branch: "All",
  subject: "All",
  year: "All",
};

// Enhanced render function
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
  if (activeFilters > 0) {
    filterCount.textContent = `${activeFilters} filter(s) active`;
  } else {
    filterCount.textContent = "";
  }

  // Show/hide no results
  if (filtered.length === 0) {
    contentDiv.classList.add("hidden");
    noResults.classList.remove("hidden");
    return;
  } else {
    contentDiv.classList.remove("hidden");
    noResults.classList.add("hidden");
  }

  // Create cards with enhanced styling
  filtered.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card bg-white shadow-md rounded-lg p-6 hover:shadow-lg border border-gray-200";
    
    // Year badge colors
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
      
      <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
        View Document 
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    `;
    
    // Add click handler
    card.addEventListener('click', () => {
      alert(`Opening: ${item.title}\n\nScheme: ${item.scheme}\nBranch: ${item.branch}\nSubject: ${item.subject}\nYear: ${item.year}\n\n${item.desc}`);
    });
    
    contentDiv.appendChild(card);
  });

  // Update filter indicators
  updateFilterIndicators();
}

// Update filter indicators on tabs
function updateFilterIndicators() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const filterType = tab.dataset.filter;
    const indicator = tab.querySelector('.filter-indicator');
    
    if (filters[filterType] !== "All") {
      indicator.classList.remove('hidden');
      tab.classList.add('active');
    } else {
      indicator.classList.add('hidden');
      tab.classList.remove('active');
    }
  });
}

// Tab click handlers
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

// Dropdown option selection
document.querySelectorAll(".dropdown li").forEach(item => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    
    const dropdown = item.parentElement;
    const filterType = dropdown.dataset.filter;
    const value = item.dataset.value;
    
    // Update filter
    filters[filterType] = value;
    
    // Update selected state
    dropdown.querySelectorAll("li").forEach(li => li.classList.remove("selected"));
    item.classList.add("selected");
    
    // Close dropdown
    dropdown.classList.remove("show");
    
    // Re-render
    renderCards();
    
    console.log(`Filter applied: ${filterType} = ${value}`);
  });
});

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".relative")) {
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
  }
});

// Clear all filters
clearBtn.addEventListener("click", () => {
  // Reset filters
  for (let key in filters) {
    filters[key] = "All";
  }
  
  // Reset selected states
  document.querySelectorAll(".dropdown li").forEach(li => {
    li.classList.remove("selected");
    if (li.dataset.value === "All") {
      li.classList.add("selected");
    }
  });
  
  // Re-render
  renderCards();
  
  console.log("All filters cleared");
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
  }
});

// Initial render
renderCards();

console.log("✅ SJC Grove - CS Engineering Navigation Ready!");
