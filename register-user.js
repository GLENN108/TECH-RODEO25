/**
 * User Registration Page Handler
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    setupRegisterForm();
});

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        formError.style.display = 'none';
        formSuccess.style.display = 'none';
        clearFieldErrors();
        
        // Get form data
        const collegeName = document.getElementById('collegeName').value.trim();
        const departmentName = document.getElementById('departmentName').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate
        if (!collegeName || !departmentName || !username || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            document.getElementById('confirmPasswordError').style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }
        
        // Disable button
        registerBtn.disabled = true;
        registerBtn.style.opacity = '0.6';
        
        try {
            // Attempt registration
            const user = registerUser(collegeName, departmentName, username, password);
            
            // Success
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            // Show error
            showError(error.message || 'Registration failed. Please try again.');
            registerBtn.disabled = false;
            registerBtn.style.opacity = '1';
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
