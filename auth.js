/**
 * Authentication System for Tech Rodeo
 * Handles user registration, login, and session management
 */

// Storage keys
const STORAGE_KEY_USERS = 'tech_rodeo_users';
const STORAGE_KEY_CURRENT_USER = 'tech_rodeo_current_user';
const STORAGE_KEY_REGISTRATIONS = 'tech_rodeo_registrations';
const STORAGE_KEY_ADMIN = 'tech_rodeo_admin';

// Default admin credentials
const DEFAULT_ADMIN_USERNAME = 'glenn';
const DEFAULT_ADMIN_PASSWORD = 'glenn123';

/**
 * Initialize authentication system
 */
function initAuth() {
    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEY_REGISTRATIONS)) {
        localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify([]));
    }
    
    // Initialize admin credentials if not set
    if (!localStorage.getItem(STORAGE_KEY_ADMIN)) {
        const adminCreds = {
            username: DEFAULT_ADMIN_USERNAME,
            password: hashPassword(DEFAULT_ADMIN_PASSWORD)
        };
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminCreds));
    } else {
        // Reset admin credentials to ensure they're correct
        const adminCreds = {
            username: DEFAULT_ADMIN_USERNAME,
            password: hashPassword(DEFAULT_ADMIN_PASSWORD)
        };
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminCreds));
    }
    
    // Check if user is already logged in
    checkAuthStatus();
}

/**
 * Check if user is logged in
 */
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User is logged in
        updateUIForLoggedInUser(currentUser);
        return true;
    }
    return false;
}

/**
 * Get current logged in user
 */
function getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Register a new user
 */
function registerUser(collegeName, departmentName, username, password) {
    // Validate input
    if (!collegeName || !departmentName || !username || !password) {
        throw new Error('All fields are required');
    }
    
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
    
    // Check if username already exists
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        throw new Error('Username already exists');
    }
    
    // Check if college already has an account
    if (users.find(u => u.collegeName.toLowerCase() === collegeName.toLowerCase())) {
        throw new Error('An account already exists for this college');
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        collegeName: collegeName.trim(),
        departmentName: departmentName.trim(),
        username: username.trim(),
        password: hashPassword(password), // Simple hash (in production, use proper hashing)
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    saveUsers(users);
    
    return newUser;
}

/**
 * Login user
 */
function loginUser(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
        throw new Error('Invalid username or password');
    }
    
    if (user.password !== hashPassword(password)) {
        throw new Error('Invalid username or password');
    }
    
    // Create user session object (don't include password)
    const userSession = {
        id: user.id,
        collegeName: user.collegeName,
        departmentName: user.departmentName || '', // Include department if available
        username: user.username,
        createdAt: user.createdAt
    };
    
    // Set current user
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(userSession));
    
    // Update UI
    updateUIForLoggedInUser(userSession);
    
    return userSession;
}

/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    updateUIForLoggedOutUser();
    window.location.href = 'index.html';
}

/**
 * Login as admin
 */
function loginAdmin(username, password) {
    // Ensure auth is initialized
    if (typeof initAuth === 'function') {
        initAuth();
    }
    
    // Get or initialize admin credentials
    let adminCreds = localStorage.getItem(STORAGE_KEY_ADMIN);
    if (!adminCreds) {
        // Force initialize
        const creds = {
            username: DEFAULT_ADMIN_USERNAME,
            password: hashPassword(DEFAULT_ADMIN_PASSWORD)
        };
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(creds));
        adminCreds = JSON.stringify(creds);
    }
    
    adminCreds = JSON.parse(adminCreds);
    
    console.log('Admin login attempt:', {
        providedUsername: username,
        storedUsername: adminCreds.username,
        usernameMatch: username === adminCreds.username,
        passwordHash: hashPassword(password),
        storedPasswordHash: adminCreds.password,
        passwordMatch: hashPassword(password) === adminCreds.password
    });
    
    if (username !== adminCreds.username) {
        throw new Error('Invalid admin username');
    }
    
    const hashedPassword = hashPassword(password);
    if (hashedPassword !== adminCreds.password) {
        throw new Error('Invalid admin password');
    }
    
    // Set admin session
    const adminSession = {
        isAdmin: true,
        username: username,
        loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(adminSession));
    
    return adminSession;
}

/**
 * Check if current user is admin
 */
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.isAdmin === true;
}

/**
 * Change admin password
 */
function changeAdminPassword(oldPassword, newPassword) {
    if (!isAdmin()) {
        throw new Error('Only admins can change password');
    }
    
    const adminCreds = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN));
    
    if (hashPassword(oldPassword) !== adminCreds.password) {
        throw new Error('Current password is incorrect');
    }
    
    if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
    }
    
    adminCreds.password = hashPassword(newPassword);
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminCreds));
    
    return true;
}

/**
 * Get all users
 */
function getUsers() {
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    return usersStr ? JSON.parse(usersStr) : [];
}

/**
 * Save users
 */
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

/**
 * Get all registrations
 */
function getRegistrations() {
    const regStr = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    return regStr ? JSON.parse(regStr) : [];
}

/**
 * Save registration
 */
function saveRegistration(registration) {
    const registrations = getRegistrations();
    registrations.push(registration);
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(registrations));
}

/**
 * Get registrations for a specific user/college
 */
function getUserRegistrations(collegeName) {
    const registrations = getRegistrations();
    return registrations.filter(r => 
        r.collegeName.toLowerCase() === collegeName.toLowerCase()
    );
}

/**
 * Check if college is already registered for an event
 */
function isCollegeRegisteredForEvent(collegeName, eventName) {
    const registrations = getRegistrations();
    return registrations.some(r => 
        r.collegeName.toLowerCase() === collegeName.toLowerCase() &&
        r.eventName.toLowerCase() === eventName.toLowerCase()
    );
}

/**
 * Simple password hash (for demo - use proper hashing in production)
 */
function hashPassword(password) {
    // Simple hash - in production, use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Update UI for logged in user
 */
function updateUIForLoggedInUser(user) {
    // Update navigation
    const loginLinks = document.querySelectorAll('.login-link, .register-link');
    loginLinks.forEach(link => {
        link.style.display = 'none';
    });
    
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.style.display = 'block';
        const userName = userMenu.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.collegeName;
        }
    }
}

/**
 * Update UI for logged out user
 */
function updateUIForLoggedOutUser() {
    const loginLinks = document.querySelectorAll('.login-link, .register-link');
    loginLinks.forEach(link => {
        link.style.display = 'block';
    });
    
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.style.display = 'none';
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initAuth();
    });
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        registerUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        checkAuthStatus,
        getRegistrations,
        saveRegistration,
        getUserRegistrations,
        isCollegeRegisteredForEvent,
        loginAdmin,
        isAdmin,
        changeAdminPassword
    };
}

