// Enhanced dummy data
const dummyData = [
  {
    id: 1,
    title: "Terra: Land Changes Analysis",
    category: "Terra",
    difficulty: "Beginner",
    subject: "Earth Science",
    year: "2025",
    desc: "Comprehensive analysis of global land use changes using Terra satellite imagery.",
    icon: "🛰️"
  },
  {
    id: 2,
    title: "Hunt for Exoplanets with AI",
    category: "Exoplanet",
    difficulty: "Advanced",
    subject: "AI",
    year: "2024",
    desc: "Advanced machine learning algorithms for detecting exoplanets.",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Climate Trends Analysis 2023",
    category: "Climate",
    difficulty: "Intermediate",
    subject: "Data Analysis",
    year: "2023",
    desc: "Statistical analysis of global climate patterns and temperature anomalies.",
    icon: "📈"
  },
  {
    id: 4,
    title: "Terra Animation Storytelling",
    category: "Terra",
    difficulty: "Intermediate",
    subject: "Storytelling",
    year: "2025",
    desc: "Creating compelling animated narratives about Earth's changing landscapes.",
    icon: "🎬"
  },
  {
    id: 5,
    title: "AI-Powered Weather Prediction",
    category: "Climate",
    difficulty: "Advanced",
    subject: "AI",
    year: "2022",
    desc: "Deep learning models for predicting extreme weather events.",
    icon: "⚡"
  },
  {
    id: 6,
    title: "Exoplanet Data Visualizations",
    category: "Exoplanet",
    difficulty: "Beginner",
    subject: "Data Analysis",
    year: "2024",
    desc: "Interactive visualization techniques for exploring exoplanet characteristics.",
    icon: "📊"
  },
  {
    id: 7,
    title: "Satellite Imagery 101",
    category: "Terra",
    difficulty: "Beginner",
    subject: "Earth Science",
    year: "2023",
    desc: "Introduction to satellite imagery interpretation and spectral analysis.",
    icon: "🌍"
  },
  {
    id: 8,
    title: "Climate Story Maps",
    category: "Climate",
    difficulty: "Intermediate",
    subject: "Storytelling",
    year: "2024",
    desc: "Interactive story maps combining geographic data with climate narratives.",
    icon: "🗺️"
  }
];

// DOM elements
const contentDiv = document.getElementById("content");
const clearBtn = document.getElementById("clearFilters");
const resultsTitle = document.getElementById("results-title");
const noResults = document.getElementById("no-results");
const filterCount = document.getElementById("filter-count");

// Current filter state
const filters = {
  category: "All",
  difficulty: "All",
  subject: "All",
  year: "All",
};

// Enhanced render function
function renderCards() {
  contentDiv.innerHTML = "";
  
  // Filter the data
  const filtered = dummyData.filter(item => {
    return (filters.category === "All" || item.category === filters.category) &&
           (filters.difficulty === "All" || item.difficulty === filters.difficulty) &&
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
    
    // Difficulty badge colors
    const difficultyColors = {
      "Beginner": "bg-green-100 text-green-800",
      "Intermediate": "bg-yellow-100 text-yellow-800",
      "Advanced": "bg-red-100 text-red-800"
    };

    card.innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="text-3xl">${item.icon}</div>
        <span class="px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[item.difficulty]}">${item.difficulty}</span>
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>
      <p class="text-gray-600 text-sm mb-4">${item.desc}</p>
      
      <div class="flex flex-wrap gap-2 mb-4 text-xs">
        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded">${item.category}</span>
        <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded">${item.subject}</span>
        <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded">${item.year}</span>
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
      alert(`Opening: ${item.title}\n\n${item.desc}`);
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

console.log("✅ SJC Grove - Enhanced Tab Navigation Ready!");
