// MINIMAL Working Dropdown Code
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ JavaScript loaded');
    
    // Test if elements exist
    const schemeBtn = document.getElementById('scheme-btn');
    const schemeDropdown = document.getElementById('scheme-dropdown');
    
    console.log('Scheme button:', schemeBtn);
    console.log('Scheme dropdown:', schemeDropdown);
    
    // Simple click test
    if (schemeBtn && schemeDropdown) {
        schemeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Button clicked!');
            
            // Toggle dropdown
            if (schemeDropdown.classList.contains('hidden')) {
                schemeDropdown.classList.remove('hidden');
                console.log('✅ Dropdown opened');
            } else {
                schemeDropdown.classList.add('hidden');
                console.log('❌ Dropdown closed');
            }
        });
    } else {
        console.error('❌ Elements not found!');
    }
});
