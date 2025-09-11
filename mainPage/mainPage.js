// Comprehensive subject mapping based on real engineering curriculum
const subjectMapping = {
  "2024": {
    "Computer Science": {
      "1": ["Mathematics I", "Physics", "Programming in C", "Engineering Graphics"],
      "2": ["Mathematics II", "Chemistry", "Data Structures", "Digital Electronics"],
      "3": ["Discrete Mathematics", "Computer Organization", "Object Oriented Programming", "Database Systems"],
      "4": ["Operating Systems", "Computer Networks", "Software Engineering", "Theory of Computation"],
      "5": ["Compiler Design", "Machine Learning", "Web Technologies", "Computer Graphics"],
      "6": ["Artificial Intelligence", "Distributed Systems", "Mobile Computing", "Information Security"],
      "7": ["Cloud Computing", "Big Data Analytics", "IoT Systems", "Blockchain Technology"],
      "8": ["Project Work", "Advanced AI", "Quantum Computing", "Professional Electives"]
    },
    "Electronics": {
      "1": ["Mathematics I", "Physics", "Basic Electrical Engineering", "Electronic Devices"],
      "2": ["Mathematics II", "Circuit Analysis", "Electronic Circuits", "Signals and Systems"],
      "3": ["Analog Electronics", "Digital Electronics", "Electromagnetic Theory", "Control Systems"],
      "4": ["Microprocessors", "Communication Systems", "Power Electronics", "VLSI Design"],
      "5": ["Embedded Systems", "Digital Signal Processing", "Antenna Theory", "RF Engineering"],
      "6": ["Optical Communication", "Wireless Communication", "Satellite Communication", "Biomedical Electronics"],
      "7": ["Advanced Communication", "Nanotechnology", "Smart Systems", "Professional Electives"],
      "8": ["Project Work", "Advanced VLSI", "5G Technology", "Industry Training"]
    },
    "Mechanical": {
      "1": ["Mathematics I", "Physics", "Engineering Mechanics", "Engineering Graphics"],
      "2": ["Mathematics II", "Thermodynamics", "Strength of Materials", "Manufacturing Processes"],
      "3": ["Fluid Mechanics", "Machine Design", "Heat Transfer", "Material Science"],
      "4": ["Dynamics of Machinery", "Automobile Engineering", "Production Technology", "Control Engineering"],
      "5": ["Refrigeration", "Power Plant Engineering", "Operations Research", "Industrial Engineering"],
      "6": ["CAD/CAM", "Robotics", "Finite Element Analysis", "Quality Control"],
      "7": ["Advanced Manufacturing", "Mechatronics", "Renewable Energy", "Professional Electives"],
      "8": ["Project Work", "Advanced Automation", "Industry 4.0", "Internship"]
    },
    "Civil": {
      "1": ["Mathematics I", "Physics", "Engineering Mechanics", "Building Materials"],
      "2": ["Mathematics II", "Strength of Materials", "Fluid Mechanics", "Surveying"],
      "3": ["Structural Analysis", "Concrete Technology", "Soil Mechanics", "Hydraulics"],
      "4": ["Steel Structures", "Foundation Engineering", "Water Resources", "Transportation Engineering"],
      "5": ["Concrete Structures", "Environmental Engineering", "Highway Engineering", "Construction Management"],
      "6": ["Advanced Structures", "Earthquake Engineering", "Remote Sensing", "Project Planning"],
      "7": ["Structural Dynamics", "Smart Cities", "Sustainable Construction", "Professional Electives"],
      "8": ["Project Work", "Advanced Design", "Green Building", "Industry Training"]
    },
    "Electrical": {
      "1": ["Mathematics I", "Physics", "Basic Electrical Engineering", "Circuit Theory"],
      "2": ["Mathematics II", "Electrical Machines", "Electronic Devices", "Measurements"],
      "3": ["Power Systems", "Control Systems", "Electrical Drives", "Power Electronics"],
      "4": ["Microprocessors", "Digital Electronics", "Instrumentation", "Communication Engineering"],
      "5": ["Power System Analysis", "Industrial Drives", "Renewable Energy", "Smart Grid"],
      "6": ["High Voltage Engineering", "Power Quality", "Electric Vehicles", "Automation"],
      "7": ["Advanced Power Systems", "Energy Management", "AI in Power", "Professional Electives"],
      "8": ["Project Work", "Grid Integration", "Industry 4.0", "Internship"]
    }
  },
  "2022": {
    "Computer Science": {
      "1": ["Mathematics I", "Physics", "Programming Fundamentals", "Computer Basics"],
      "2": ["Mathematics II", "Chemistry", "Data Structures", "Digital Logic"],
      "3": ["Algorithms", "Computer Architecture", "Database Systems", "OOP Concepts"],
      "4": ["Operating Systems", "Networks", "Software Engineering", "Web Development"],
      "5": ["Compiler Design", "AI Basics", "Mobile Apps", "System Security"],
      "6": ["Machine Learning", "Cloud Basics", "IoT Fundamentals", "Data Mining"],
      "7": ["Deep Learning", "Blockchain", "Advanced Databases", "Electives"],
      "8": ["Final Project", "Industry Training", "Research Work", "Capstone"]
    },
    "Electronics": {
      "1": ["Mathematics I", "Physics", "Circuit Basics", "Electronic Components"],
      "2": ["Mathematics II", "Network Theory", "Electronic Circuits", "Measurements"],
      "3": ["Analog Circuits", "Digital Systems", "Electromagnetic Fields", "Control Theory"],
      "4": ["Microcontrollers", "Communication Basics", "Power Circuits", "Signal Processing"],
      "5": ["Embedded Programming", "Wireless Systems", "VLSI Basics", "Instrumentation"],
      "6": ["Advanced Communication", "Sensor Technology", "Automation", "Robotics Basics"],
      "7": ["IoT Systems", "Advanced VLSI", "Smart Electronics", "Industry Projects"],
      "8": ["Capstone Project", "Industry Integration", "Advanced Topics", "Professional Training"]
    }
    // Add other branches for 2022 scheme...
  }
  // Add other schemes as needed...
};

// Expanded dummy data with comprehensive coverage
const dummyData = [
    // Scheme 2024 - Computer Science
    {
        id: 1,
        title: "Mathematics I - Complete Notes",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Mathematics I",
        semester: "1",
        year: "1st Year",
        desc: "Comprehensive calculus, linear algebra, and differential equations for first semester.",
        icon: "📐"
    },
    {
        id: 2,
        title: "Programming in C - Lab Manual",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Programming in C",
        semester: "1",
        year: "1st Year",
        desc: "Complete C programming tutorial with practical exercises and projects.",
        icon: "💻"
    },
    {
        id: 3,
        title: "Physics for Engineers",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Physics",
        semester: "1",
        year: "1st Year",
        desc: "Applied physics concepts with engineering applications and laboratory experiments.",
        icon: "⚗️"
    },
    {
        id: 4,
        title: "Data Structures and Algorithms",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Data Structures",
        semester: "2",
        year: "1st Year",
        desc: "Comprehensive guide to data structures implementation and algorithm analysis.",
        icon: "🔗"
    },
    {
        id: 5,
        title: "Database Management Systems",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Database Systems",
        semester: "3",
        year: "2nd Year",
        desc: "Complete DBMS concepts covering SQL, normalization, and database design.",
        icon: "🗄️"
    },
    {
        id: 6,
        title: "Computer Networks Fundamentals",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Computer Networks",
        semester: "4",
        year: "2nd Year",
        desc: "Network protocols, OSI model, TCP/IP, and network security essentials.",
        icon: "🌐"
    },
    {
        id: 7,
        title: "Operating Systems Concepts",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Operating Systems",
        semester: "4",
        year: "2nd Year",
        desc: "Process management, memory allocation, file systems, and system calls.",
        icon: "⚙️"
    },
    {
        id: 8,
        title: "Software Engineering Principles",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Software Engineering",
        semester: "4",
        year: "2nd Year",
        desc: "Software development lifecycle, testing, and project management methodologies.",
        icon: "🔧"
    },
    {
        id: 9,
        title: "Machine Learning Fundamentals",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Machine Learning",
        semester: "5",
        year: "3rd Year",
        desc: "Introduction to ML algorithms, supervised and unsupervised learning techniques.",
        icon: "🤖"
    },
    {
        id: 10,
        title: "Artificial Intelligence Guide",
        scheme: "2024",
        branch: "Computer Science",
        subject: "Artificial Intelligence",
        semester: "6",
        year: "3rd Year",
        desc: "AI fundamentals, search algorithms, knowledge representation, and expert systems.",
        icon: "🧠"
    },
    
    // Electronics Engineering Cards
    {
        id: 11,
        title: "Digital Electronics Lab",
        scheme: "2024",
        branch: "Electronics",
        subject: "Digital Electronics",
        semester: "3",
        year: "2nd Year",
        desc: "Logic gates, flip-flops, counters, and digital circuit design experiments.",
        icon: "🔌"
    },
    {
        id: 12,
        title: "Microprocessors and Applications",
        scheme: "2024",
        branch: "Electronics",
        subject: "Microprocessors",
        semester: "4",
        year: "2nd Year",
        desc: "8085/8086 microprocessor architecture, programming, and interfacing techniques.",
        icon: "💾"
    },
    {
        id: 13,
        title: "Communication Systems Theory",
        scheme: "2024",
        branch: "Electronics",
        subject: "Communication Systems",
        semester: "4",
        year: "2nd Year",
        desc: "Analog and digital communication, modulation techniques, and signal analysis.",
        icon: "📡"
    },
    {
        id: 14,
        title: "Embedded Systems Design",
        scheme: "2024",
        branch: "Electronics",
        subject: "Embedded Systems",
        semester: "5",
        year: "3rd Year",
        desc: "Microcontroller programming, real-time systems, and embedded applications.",
        icon: "🎛️"
    },

    // Mechanical Engineering Cards
    {
        id: 15,
        title: "Engineering Mechanics",
        scheme: "2024",
        branch: "Mechanical",
        subject: "Engineering Mechanics",
        semester: "1",
        year: "1st Year",
        desc: "Statics, dynamics, and strength of materials for mechanical engineers.",
        icon: "🔩"
    },
    {
        id: 16,
        title: "Thermodynamics Fundamentals",
        scheme: "2024",
        branch: "Mechanical",
        subject: "Thermodynamics",
        semester: "2",
        year: "1st Year",
        desc: "Laws of thermodynamics, heat engines, and refrigeration cycles.",
        icon: "🌡️"
    },
    {
        id: 17,
        title: "Machine Design Handbook",
        scheme: "2024",
        branch: "Mechanical",
        subject: "Machine Design",
        semester: "3",
        year: "2nd Year",
        desc: "Design of machine elements, gears, bearings, and mechanical components.",
        icon: "⚙️"
    },
    {
        id: 18,
        title: "Automobile Engineering",
        scheme: "2024",
        branch: "Mechanical",
        subject: "Automobile Engineering",
        semester: "4",
        year: "2nd Year",
        desc: "IC engines, transmission systems, chassis, and automotive technology.",
        icon: "🚗"
    },

    // Civil Engineering Cards
    {
        id: 19,
        title: "Structural Analysis Guide",
        scheme: "2024",
        branch: "Civil",
        subject: "Structural Analysis",
        semester: "3",
        year: "2nd Year",
        desc: "Analysis of beams, trusses, and frames using classical methods.",
        icon: "🏗️"
    },
    {
        id: 20,
        title: "Concrete Technology",
        scheme: "2024",
        branch: "Civil",
        subject: "Concrete Technology",
        semester: "3",
        year: "2nd Year",
        desc: "Properties of concrete, mix design, and construction techniques.",
        icon: "🧱"
    },
    {
        id: 21,
        title: "Transportation Engineering",
        scheme: "2024",
        branch: "Civil",
        subject: "Transportation Engineering",
        semester: "4",
        year: "2nd Year",
        desc: "Highway design, traffic engineering, and transportation planning.",
        icon: "🛣️"
    },

    // Electrical Engineering Cards
    {
        id: 22,
        title: "Electrical Circuits Analysis",
        scheme: "2024",
        branch: "Electrical",
        subject: "Circuit Theory",
        semester: "1",
        year: "1st Year",
        desc: "AC/DC circuit analysis, network theorems, and electrical measurements.",
        icon: "⚡"
    },
    {
        id: 23,
        title: "Electrical Machines",
        scheme: "2024",
        branch: "Electrical",
        subject: "Electrical Machines",
        semester: "2",
        year: "1st Year",
        desc: "DC machines, transformers, induction motors, and synchronous machines.",
        icon: "🔋"
    },
    {
        id: 24,
        title: "Power Systems Engineering",
        scheme: "2024",
        branch: "Electrical",
        subject: "Power Systems",
        semester: "3",
        year: "2nd Year",
        desc: "Power generation, transmission, distribution, and protection systems.",
        icon: "🏭"
    },

    // 2022 Scheme Cards
    {
        id: 25,
        title: "Programming Fundamentals - 2022",
        scheme: "2022",
        branch: "Computer Science",
        subject: "Programming Fundamentals",
        semester: "1",
        year: "1st Year",
        desc: "Basic programming concepts and problem-solving techniques.",
        icon: "📚"
    },
    {
        id: 26,
        title: "Algorithms Design - 2022",
        scheme: "2022",
        branch: "Computer Science",
        subject: "Algorithms",
        semester: "3",
        year: "2nd Year",
        desc: "Algorithm design techniques, complexity analysis, and optimization.",
        icon: "🔍"
    },

    // Add more cards to ensure every filter combination has content...
];

// DOM elements
const contentDiv = document.getElementById("content");
const clearBtn = document.getElementById("clearFilters");
const resultsTitle = document.getElementById("results-title");
const noResults = document.getElementById("no-results");
const filterCount = document.getElementById("filter-count");

// Filter state - updated to include semester
const filters = {
    scheme: "All",
    branch: "All", 
    semester: "All",
    subject: "All"
};

// Function to update subject dropdown based on scheme, branch, and semester
function updateSubjectDropdown() {
    const subjectDropdown = document.getElementById('subject-dropdown');
    const scheme = filters.scheme;
    const branch = filters.branch;
    const semester = filters.semester;
    
    // Reset to default if any parent filter is "All"
    if (scheme === "All" || branch === "All" || semester === "All") {
        subjectDropdown.innerHTML = `
            <li data-value="All" class="selected">All Subjects</li>
            <li data-value="Mathematics">Mathematics</li>
            <li data-value="Physics">Physics</li>
            <li data-value="Programming">Programming</li>
            <li data-value="Electronics">Electronics</li>
        `;
        return;
    }
    
    // Get subjects for the selected combination
    const subjects = subjectMapping[scheme]?.[branch]?.[semester] || [];
    
    let subjectHTML = '<li data-value="All" class="selected">All Subjects</li>';
    subjects.forEach(subject => {
        subjectHTML += `<li data-value="${subject}">${subject}</li>`;
    });
    
    subjectDropdown.innerHTML = subjectHTML;
    
    // Reset subject filter when dropdown changes
    filters.subject = "All";
    
    // Update subject button text
    const subjectButton = document.querySelector('[data-filter="subject"]');
    if (subjectButton) {
        const indicator = subjectButton.querySelector('.filter-indicator');
        subjectButton.textContent = 'Subject';
        if (indicator) subjectButton.appendChild(indicator);
    }
}

// Enhanced render function
function renderCards() {
    contentDiv.innerHTML = "";
    
    // Filter the data
    const filtered = dummyData.filter(item => {
        return (filters.scheme === "All" || item.scheme === filters.scheme) &&
               (filters.branch === "All" || item.branch === filters.branch) &&
               (filters.semester === "All" || item.semester === filters.semester) &&
               (filters.subject === "All" || item.subject === filters.subject);
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
                <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded">Sem ${item.semester}</span>
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

    updateFilterIndicators();
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
// DROPDOWN EVENT HANDLERS
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

// 2. Enhanced dropdown option selection
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
            
            // Update subject dropdown if scheme, branch, or semester changed
            if (['scheme', 'branch', 'semester'].includes(filterType)) {
                updateSubjectDropdown();
            }
            
            // Re-render cards
            renderCards();
            
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
        
        // Reset subject dropdown to default
        updateSubjectDropdown();
        
        // Re-render
        renderCards();
        
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
    console.log('✅ Main page ready with dynamic subject dropdown!');
});

console.log("✅ SJC Grove Main Page - Ready with comprehensive engineering curriculum!");
