/**
 * Admin Panel Handler
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    if (isAdmin()) {
        // Show dashboard
        document.getElementById('adminLoginSection').style.display = 'none';
        document.getElementById('adminDashboardSection').style.display = 'block';
        loadAdminData();
    } else {
        // Show login form
        document.getElementById('adminLoginSection').style.display = 'block';
        document.getElementById('adminDashboardSection').style.display = 'none';
        setupAdminLogin();
    }
});

function setupAdminLogin() {
    const form = document.getElementById('adminLoginForm');
    const loginBtn = document.getElementById('adminLoginBtn');
    const loginError = document.getElementById('adminLoginError');
    
    // Remove existing listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        loginError.style.display = 'none';
        
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        
        if (!username || !password) {
            showAdminError('Please enter both username and password');
            return;
        }
        
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.6';
        
        try {
            console.log('Attempting admin login with:', username);
            loginAdmin(username, password);
            console.log('Admin login successful');
            // Reload to show dashboard
            window.location.reload();
        } catch (error) {
            console.error('Admin login error:', error);
            showAdminError(error.message || 'Invalid admin credentials');
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
        }
    });
}

function showAdminError(message) {
    const loginError = document.getElementById('adminLoginError');
    const errorMessage = document.getElementById('adminLoginErrorMessage');
    
    errorMessage.textContent = message;
    loginError.style.display = 'block';
    loginError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function loadAdminData() {
    const registrations = getRegistrations();
    const users = getUsers();
    
    // Calculate statistics
    const totalRegistrations = registrations.length;
    const uniqueColleges = new Set(registrations.map(r => r.collegeName.toLowerCase())).size;
    const uniqueEvents = new Set(registrations.map(r => r.eventName.toLowerCase())).size;
    
    // Update statistics
    document.getElementById('totalRegistrations').textContent = totalRegistrations;
    document.getElementById('totalColleges').textContent = uniqueColleges;
    document.getElementById('totalEvents').textContent = uniqueEvents;
    
    // Display registrations table
    displayRegistrationsTable(registrations);
}

function displayRegistrationsTable(registrations) {
    const tableContainer = document.getElementById('registrationsTable');
    
    if (registrations.length === 0) {
        tableContainer.innerHTML = `
            <p style="text-align: center; color: var(--text-gray); padding: 2rem;">No registrations yet.</p>
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
        
        html += `
            <div style="margin-bottom: 2rem;">
                <h4 style="font-family: 'Orbitron', sans-serif; color: var(--primary-blue); margin-bottom: 1rem; text-transform: uppercase;">
                    ${formatEventName(eventName)} (${eventRegs.length} registrations)
                </h4>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-family: 'Rajdhani', sans-serif;">
                        <thead>
                            <tr style="background: rgba(0, 212, 255, 0.1);">
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">College</th>
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">Department</th>
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">Member 1</th>
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">Member 2</th>
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">Contact</th>
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">Email</th>
                                <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(0, 212, 255, 0.3); color: var(--primary-blue);">Date</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        eventRegs.forEach(reg => {
            html += `
                <tr style="border-bottom: 1px solid rgba(0, 212, 255, 0.1);">
                    <td style="padding: 0.8rem; color: var(--text-light);">${reg.collegeName}</td>
                    <td style="padding: 0.8rem; color: var(--text-light);">${reg.departmentName}</td>
                    <td style="padding: 0.8rem; color: var(--text-light);">${reg.member1Name}</td>
                    <td style="padding: 0.8rem; color: var(--text-light);">${reg.member2Name}</td>
                    <td style="padding: 0.8rem; color: var(--text-light);">${reg.contactNumber}</td>
                    <td style="padding: 0.8rem; color: var(--text-light);">${reg.contactEmail}</td>
                    <td style="padding: 0.8rem; color: var(--text-gray); font-size: 0.9rem;">${new Date(reg.timestamp).toLocaleDateString()}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    
    tableContainer.innerHTML = html;
}

function formatEventName(eventName) {
    return eventName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function exportRegistrations() {
    const registrations = getRegistrations();
    
    if (registrations.length === 0) {
        alert('No registrations to export');
        return;
    }
    
    // Create CSV
    const headers = ['Event', 'College', 'Department', 'Member 1', 'Member 2', 'Contact Number', 'Email', 'Registration Date'];
    const rows = registrations.map(reg => [
        formatEventName(reg.eventName),
        reg.collegeName,
        reg.departmentName,
        reg.member1Name,
        reg.member2Name,
        reg.contactNumber,
        reg.contactEmail,
        new Date(reg.timestamp).toLocaleString()
    ]);
    
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-rodeo-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

