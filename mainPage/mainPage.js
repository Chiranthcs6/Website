// Enhanced dropdown system with dynamic content and clear functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ SJC Grove Main Page loaded');
    
    const dropdowns = [
        { btn: 'scheme-btn', menu: 'scheme-dropdown', key: 'scheme' },
        { btn: 'branch-btn', menu: 'branch-dropdown', key: 'branch' },
        { btn: 'semester-btn', menu: 'semester-dropdown', key: 'semester' },
        { btn: 'subject-btn', menu: 'subject-dropdown', key: 'subject' }
    ];
    
    let selections = {
        scheme: null,
        branch: null,
        semester: null,
        subject: null
    };

    // Initialize dropdowns
    dropdowns.forEach(({ btn, menu, key }) => {
        const button = document.getElementById(btn);
        const dropdown = document.getElementById(menu);
        
        if (!button || !dropdown) return;
        
        // Button click handler
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            dropdowns.forEach(({ menu: otherMenu }) => {
                if (otherMenu !== menu) {
                    document.getElementById(otherMenu).classList.add('hidden');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('hidden');
        });
        
        // Option click handler
        dropdown.querySelectorAll('a').forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                const isSelected = this.classList.contains('selected');
                
                if (isSelected) {
                    // Deselect option
                    this.classList.remove('selected');
                    selections[key] = null;
                    button.querySelector('span').textContent = key.charAt(0).toUpperCase() + key.slice(1);
                    
                    // Clear dependent selections
                    clearDependentSelections(key);
                } else {
                    // Select option
                    dropdown.querySelectorAll('a').forEach(item => {
                        item.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    selections[key] = { value, text };
                    button.querySelector('span').textContent = text;
                }
                
                dropdown.classList.add('hidden');
                updatePreferences();
                updateDynamicContent();
            });
        });
    });
    
    // Clear dependent selections when parent changes
    function clearDependentSelections(changedKey) {
        const keys = ['scheme', 'branch', 'semester', 'subject'];
        const index = keys.indexOf(changedKey);
        
        for (let i = index + 1; i < keys.length; i++) {
            const dependentKey = keys[i];
            selections[dependentKey] = null;
            
            // Reset button text
            const btn = document.getElementById(`${dependentKey}-btn`);
            if (btn) {
                btn.querySelector('span').textContent = dependentKey.charAt(0).toUpperCase() + dependentKey.slice(1);
            }
            
            // Clear selected class from options
            const menu = document.getElementById(`${dependentKey}-dropdown`);
            if (menu) {
                menu.querySelectorAll('a').forEach(item => {
                    item.classList.remove('selected');
                });
            }
        }
    }
    
    // Update preferences display
    function updatePreferences() {
        const selectionDiv = document.getElementById('current-selection');
        const hasSelections = Object.values(selections).some(sel => sel !== null);
        
        if (hasSelections) {
            selectionDiv.classList.remove('hidden');
            
            // Update individual displays
            Object.keys(selections).forEach(key => {
                const span = document.getElementById(`selected-${key}`);
                if (span) {
                    span.textContent = selections[key] ? selections[key].text : '-';
                }
            });
            
            // Add clear button if not exists
            let clearBtn = document.getElementById('clear-all-btn');
            if (!clearBtn) {
                clearBtn = document.createElement('button');
                clearBtn.id = 'clear-all-btn';
                clearBtn.className = 'mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200';
                clearBtn.textContent = 'Clear All Selections';
                clearBtn.addEventListener('click', clearAllSelections);
                selectionDiv.appendChild(clearBtn);
            }
        } else {
            selectionDiv.classList.add('hidden');
        }
    }
    
    // Clear all selections
    function clearAllSelections() {
        selections = { scheme: null, branch: null, semester: null, subject: null };
        
        // Reset all buttons
        dropdowns.forEach(({ btn, key }) => {
            const button = document.getElementById(btn);
            if (button) {
                button.querySelector('span').textContent = key.charAt(0).toUpperCase() + key.slice(1);
            }
        });
        
        // Remove selected class from all options
        dropdowns.forEach(({ menu }) => {
            const dropdown = document.getElementById(menu);
            if (dropdown) {
                dropdown.querySelectorAll('a').forEach(item => {
                    item.classList.remove('selected');
                });
            }
        });
        
        updatePreferences();
        updateDynamicContent();
        
        // Remove clear button
        const clearBtn = document.getElementById('clear-all-btn');
        if (clearBtn) {
            clearBtn.remove();
        }
        
        alert('All selections cleared!');
    }
    
    // Update dynamic content area
    function updateDynamicContent() {
        const contentArea = document.getElementById('dynamic-content');
        const hasSelections = Object.values(selections).some(sel => sel !== null);
        const allSelected = Object.values(selections).every(sel => sel !== null);
        
        if (!hasSelections) {
            // Show default PDF boxes
            contentArea.innerHTML = `
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${createPdfBox('Sample Document 1', 'doc1.html')}
                    ${createPdfBox('Sample Document 2', 'doc2.html')}
                    ${createPdfBox('Sample Document 3', 'doc3.html')}
                    ${createPdfBox('Sample Document 4', 'doc4.html')}
                    ${createPdfBox('Sample Document 5', 'doc5.html')}
                    ${createPdfBox('Sample Document 6', 'doc6.html')}
                </div>
            `;
            
            // Add click handlers to PDF boxes
            contentArea.querySelectorAll('.pdf-box').forEach(box => {
                box.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    window.open(url, '_blank');
                });
            });
            
        } else if (allSelected) {
            // Show final selection
            contentArea.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-green-800 mb-4">📚 Your Selected Resource</h3>
                    <div class="space-y-2 text-sm text-green-700">
                        <p><strong>Scheme:</strong> ${selections.scheme.text}</p>
                        <p><strong>Branch:</strong> ${selections.branch.text}</p>
                        <p><strong>Semester:</strong> ${selections.semester.text}</p>
                        <p><strong>Subject:</strong> ${selections.subject.text}</p>
                    </div>
                    <div class="mt-4 grid md:grid-cols-2 gap-4">
                        ${createPdfBox('Lecture Notes', 'notes.html')}
                        ${createPdfBox('Previous Papers', 'papers.html')}
                        ${createPdfBox('Lab Manuals', 'labs.html')}
                        ${createPdfBox('Reference Books', 'books.html')}
                    </div>
                </div>
            `;
            
            // Add click handlers to PDF boxes
            contentArea.querySelectorAll('.pdf-box').forEach(box => {
                box.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    window.open(url, '_blank');
                });
            });
            
        } else {
            // Show progress indicator
            const selectedCount = Object.values(selections).filter(sel => sel !== null).length;
            contentArea.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-yellow-800 mb-2">⚡ Continue Selection</h3>
                    <p class="text-yellow-700 mb-4">Please complete your selection (${selectedCount}/4 selected)</p>
                    <div class="flex space-x-2">
                        ${['scheme', 'branch', 'semester', 'subject'].map(key => 
                            `<div class="w-6 h-6 rounded-full ${selections[key] ? 'bg-green-500' : 'bg-gray-300'}"></div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // Create PDF box HTML
    function createPdfBox(title, url) {
        return `
            <div class="pdf-box bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 cursor-pointer" data-url="${url}">
                <div class="flex items-center">
                    <svg class="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12V6l-4-4H4v16zM9 3h2v4h4l-6-6v2z"/>
                        <path d="M7 13h6v1H7v-1zm0-2h6v1H7v-1zm0-2h6v1H7v-1z"/>
                    </svg>
                    <div>
                        <h4 class="font-medium text-gray-800">${title}</h4>
                        <p class="text-sm text-gray-500">Click to view document</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Close dropdowns on outside click
    document.addEventListener('click', function() {
        dropdowns.forEach(({ menu }) => {
            document.getElementById(menu).classList.add('hidden');
        });
    });
    
    // Initialize content
    updateDynamicContent();
    
    console.log('✅ Enhanced dropdown system initialized');
});
