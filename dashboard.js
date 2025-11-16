/**
 * Student Dashboard Handler
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    displayUserInfo(currentUser);
    
    // Load registrations
    loadRegistrations(currentUser);
});

function displayUserInfo(user) {
    document.getElementById('collegeInfo').textContent = `College: ${user.collegeName}`;
    document.getElementById('departmentInfo').textContent = `Department: ${user.departmentName}`;
}

function loadRegistrations(user) {
    const registrations = getUserRegistrations(user.collegeName);
    const registrationsList = document.getElementById('registrationsList');
    
    if (registrations.length === 0) {
        registrationsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: rgba(10, 14, 39, 0.6); border-radius: 12px; border: 2px dashed rgba(0, 212, 255, 0.3);">
                <p style="color: var(--text-gray); font-size: 1.1rem; margin-bottom: 1rem;">No registrations yet</p>
                <a href="events.html" style="color: var(--primary-blue); text-decoration: none; font-weight: 600;">Browse Events →</a>
            </div>
        `;
        return;
    }
    
    // Group by event
    const eventGroups = {};
    registrations.forEach(reg => {
        if (!eventGroups[reg.eventName]) {
            eventGroups[reg.eventName] = [];
        }
        eventGroups[reg.eventName].push(reg);
    });
    
    let html = '';
    Object.keys(eventGroups).forEach(eventName => {
        const eventRegs = eventGroups[eventName];
        const reg = eventRegs[0]; // Get first registration
        
        html += `
            <div class="registration-card" style="background: rgba(10, 14, 39, 0.6); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <h3 style="font-family: 'Orbitron', sans-serif; color: var(--primary-blue); margin-bottom: 1rem; text-transform: uppercase;">
                    ${formatEventName(reg.eventName)}
                </h3>
                <div style="font-family: 'Rajdhani', sans-serif; color: var(--text-light);">
                    <p style="margin: 0.5rem 0;"><strong>Member 1:</strong> ${reg.member1Name}</p>
                    <p style="margin: 0.5rem 0;"><strong>Member 2:</strong> ${reg.member2Name}</p>
                    <p style="margin: 0.5rem 0;"><strong>Contact:</strong> ${reg.contactNumber}</p>
                    <p style="margin: 0.5rem 0;"><strong>Email:</strong> ${reg.contactEmail}</p>
                    <p style="margin: 0.5rem 0; color: var(--text-gray); font-size: 0.9rem;">
                        Registered: ${new Date(reg.timestamp).toLocaleString()}
                    </p>
                </div>
            </div>
        `;
    });
    
    registrationsList.innerHTML = html;
}

function formatEventName(eventName) {
    return eventName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
