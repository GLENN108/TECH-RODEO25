/**
 * Tech Rodeo Landing Page - JavaScript
 * Handles interactive elements and future extensibility
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * Initialize page interactions
 */
function initializePage() {
    setupRegisterButton();
    setupFloatingElements();
    addScrollAnimations();
}

/**
 * Setup Register Button Click Handler
 * This can be extended later to navigate to registration page
 */
function setupRegisterButton() {
    const registerBtn = document.getElementById('registerBtn');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            handleRegisterClick();
        });
    }
}

/**
 * Handle Register Button Click
 * Navigates to the events page where users can view and register for events
 */
function handleRegisterClick() {
    // Add click animation feedback
    const btn = document.getElementById('registerBtn');
    btn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        btn.style.transform = '';
        // Navigate to events page
        window.location.href = 'events.html';
    }, 150);
}

/**
 * Enhance floating elements with dynamic behavior
 */
function setupFloatingElements() {
    const shapes = document.querySelectorAll('.tech-shape');
    
    // Add random movement on mouse move (subtle parallax effect)
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * Add scroll animations for future content sections
 */
function addScrollAnimations() {
    // Intersection Observer for fade-in animations
    // This is prepared for future content sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with 'fade-in' class (for future sections)
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Utility function for future navigation
 * Can be used to navigate between pages (event list, rules, registration)
 */
function navigateToPage(pageName) {
    // Future implementation for multi-page navigation
    // window.location.href = `${pageName}.html`;
    console.log(`Navigate to: ${pageName}`);
}

/**
 * Utility function for future API integration
 * Can be used to save registration data to Firebase or other APIs
 */
async function saveRegistrationData(data) {
    // Future implementation for database saving
    // Example structure:
    /*
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
    */
    console.log('Registration data:', data);
}

/**
 * Export functions for future use in other pages
 * This allows the script to be modular and reusable
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToPage,
        saveRegistrationData,
        handleRegisterClick
    };
}

