/**
 * Tech Rodeo Events Page - JavaScript
 * Handles navigation and interactions for the events page
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventsPage();
});

/**
 * Initialize events page interactions
 */
function initializeEventsPage() {
    setupEventCards();
    setupMenuButton();
}

/**
 * Setup event card interactions
 */
function setupEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Add click animation
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the button directly
            if (!e.target.classList.contains('event-details-btn')) {
                const eventName = card.getAttribute('data-event');
                navigateToEvent(eventName);
            }
        });

        // Add hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Navigate to specific event detail page
 * @param {string} eventName - The event name in lowercase
 */
function navigateToEvent(eventName) {
    // Navigate to the event detail page
    window.location.href = `events/${eventName}.html`;
}

/**
 * Setup menu button (placeholder for future menu functionality)
 */
function setupMenuButton() {
    const menuBtn = document.getElementById('menuBtn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            // TODO: Add menu functionality
            console.log('Menu button clicked - Menu functionality coming soon');
            // Example: toggleMenu();
        });
    }
}

// Make function available globally for onclick handlers
window.navigateToEvent = navigateToEvent;

