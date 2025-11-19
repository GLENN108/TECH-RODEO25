/**
 * Login Page Handler
 */

let selectedLoginType = '';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        if (currentUser.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return;
    }
    
    // Setup department dropdown handler
    setupDepartmentDropdown();
});

function setupDepartmentDropdown() {
    // Wait a bit to ensure DOM is ready after form clone
    setTimeout(function() {
        const departmentSelect = document.getElementById('departmentName');
        const otherDepartmentGroup = document.getElementById('otherDepartmentGroup');
        const otherDepartmentInput = document.getElementById('otherDepartmentName');
        
        if (!departmentSelect || !otherDepartmentGroup) {
            return;
        }
        
        // Remove any existing listeners by cloning the element
        const newSelect = departmentSelect.cloneNode(true);
        newSelect.value = departmentSelect.value;
        departmentSelect.parentNode.replaceChild(newSelect, departmentSelect);
        
        // Add event listener to the new select element
        newSelect.addEventListener('change', function() {
            if (this.value === 'OTHER') {
                otherDepartmentGroup.style.display = 'block';
                if (otherDepartmentInput) {
                    otherDepartmentInput.setAttribute('required', 'required');
                }
            } else {
                otherDepartmentGroup.style.display = 'none';
                if (otherDepartmentInput) {
                    otherDepartmentInput.removeAttribute('required');
                    otherDepartmentInput.value = '';
                }
            }
        });
        
        // Trigger change event if OTHER is already selected
        if (newSelect.value === 'OTHER') {
            newSelect.dispatchEvent(new Event('change'));
        }
    }, 100);
}

function selectLoginType(type) {
    selectedLoginType = type;
    const loginTypeSelection = document.getElementById('loginTypeSelection');
    const loginForm = document.getElementById('loginForm');
    const departmentGroup = document.getElementById('departmentGroup');
    const subtitle = document.querySelector('.register-subtitle');
    
    // Hide selection, show form
    loginTypeSelection.style.display = 'none';
    loginForm.style.display = 'block';
    
    // Set login type
    document.getElementById('loginType').value = type;
    
        // Update subtitle and show/hide elements
        const registerLink = document.getElementById('registerLink');
        const collegeNameGroup = document.getElementById('collegeNameGroup');
        const otherDepartmentGroup = document.getElementById('otherDepartmentGroup');
        if (type === 'admin') {
            subtitle.textContent = 'Login as Administrator';
            departmentGroup.style.display = 'none';
            collegeNameGroup.style.display = 'none';
            if (otherDepartmentGroup) otherDepartmentGroup.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
        } else {
            subtitle.textContent = 'Login as College - Enter your college and department';
            collegeNameGroup.style.display = 'block';
            departmentGroup.style.display = 'block';
            if (otherDepartmentGroup) otherDepartmentGroup.style.display = 'none';
            document.getElementById('collegeName').required = true;
            document.getElementById('departmentName').required = true;
            if (registerLink) registerLink.style.display = 'block';
        }
    
    // Setup form handler
    setupLoginForm(type);
}

function goBackToSelection() {
    selectedLoginType = '';
    const loginTypeSelection = document.getElementById('loginTypeSelection');
    const loginForm = document.getElementById('loginForm');
    
    loginTypeSelection.style.display = 'block';
    loginForm.style.display = 'none';
    
    // Clear form
    document.getElementById('loginForm').reset();
    clearFieldErrors();
    document.getElementById('formError').style.display = 'none';
}

function setupLoginForm(type) {
    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const formError = document.getElementById('formError');
    
    // Remove existing listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Setup department dropdown handler AFTER form is cloned
    if (type === 'college') {
        setupDepartmentDropdown();
    }
    
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        formError.style.display = 'none';
        clearFieldErrors();
        
        // Get form data
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const collegeName = type === 'college' ? document.getElementById('collegeName').value.trim() : '';
        
        // Get department - handle OTHER option
        let departmentName = '';
        if (type === 'college') {
            const departmentSelect = document.getElementById('departmentName');
            if (departmentSelect) {
                const selectedDept = departmentSelect.value.trim();
                if (selectedDept === 'OTHER') {
                    const otherDeptInput = document.getElementById('otherDepartmentName');
                    departmentName = otherDeptInput ? otherDeptInput.value.trim() : '';
                } else {
                    departmentName = selectedDept;
                }
            }
        }
        
        // Validate
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        if (type === 'college') {
            if (!collegeName) {
                showError('Please enter your college name');
                document.getElementById('collegeNameError').textContent = 'College name is required';
                document.getElementById('collegeNameError').style.display = 'block';
                return;
            }
            if (!departmentName) {
                showError('Please enter your department name');
                if (document.getElementById('departmentName').value === 'OTHER') {
                    document.getElementById('otherDepartmentNameError').textContent = 'Department name is required';
                    document.getElementById('otherDepartmentNameError').style.display = 'block';
                } else {
                    document.getElementById('departmentNameError').textContent = 'Department name is required';
                    document.getElementById('departmentNameError').style.display = 'block';
                }
                return;
            }
        }
        
        // Disable button
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.6';
        
        try {
            if (type === 'admin') {
                // Admin login
                const admin = loginAdmin(username, password);
                window.location.href = 'admin.html';
            } else {
                // College login
                const user = loginUser(username, password);
                
                // Verify college name matches (security check - ensures we know which college is logging in)
                if (user.collegeName.toLowerCase() !== collegeName.toLowerCase()) {
                    // Clear session since validation failed (don't redirect)
                    localStorage.removeItem('tech_rodeo_current_user');
                    showError('College name does not match your account. Please enter the correct college name.');
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                    return;
                }
                
                // Update user with department if provided
                // CRITICAL: Never save "OTHER" as department name - always save the actual department
                if (departmentName && departmentName !== 'OTHER') {
                    const users = getUsers();
                    const userIndex = users.findIndex(u => u.id === user.id);
                    if (userIndex !== -1) {
                        users[userIndex].departmentName = departmentName;
                        saveUsers(users);
                        // Update session
                        user.departmentName = departmentName;
                        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
                    }
                } else if (departmentName === 'OTHER') {
                    // If "OTHER" is somehow provided, it means the custom input wasn't filled
                    localStorage.removeItem('tech_rodeo_current_user');
                    showError('Please enter your custom department name in the "Specify Department Name" field.');
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                    return;
                } else if (!user.departmentName) {
                    // If no department provided and user doesn't have one, clear session and show error (don't redirect)
                    localStorage.removeItem('tech_rodeo_current_user');
                    showError('Department name is required for college login');
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                    return;
                }
                
                // Login successful - redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            // Show error - login failed
            showError(error.message || 'Invalid username or password');
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
        }
    });
}

function showError(message) {
    const formError = document.getElementById('formError');
    const errorMessageText = document.getElementById('errorMessageText');
    
    errorMessageText.textContent = message;
    formError.style.display = 'block';
    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFieldErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll('.form-input');
    inputElements.forEach(el => {
        el.classList.remove('input-error');
    });
}
