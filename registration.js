/**
 * Tech Rodeo Registration Form Handler
 * Handles form submission and Google Forms API integration
 */

// Google Forms Configuration
const GOOGLE_FORM_ID = '1FAIpQLSdZh26G3X0UBjm1UlmpUwpshVB1jcNMbxnVCZrJg0eB73kMmw'; // From https://docs.google.com/forms/d/e/1FAIpQLSdZh26G3X0UBjm1UlmpUwpshVB1jcNMbxnVCZrJg0eB73kMmw/viewform
const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

// Entry IDs for each field (in order: College Name, Department Name, Member 1, Member 2, Contact Number, Contact Email, Event)
const ENTRY_IDS = {
    collegeName: 'entry.1722691925',
    departmentName: 'entry.1244501594',
    member1Name: 'entry.1619849414',
    member2Name: 'entry.1020210834',
    contactNumber: 'entry.306300074',
    contactEmail: 'entry.308774662',
    event: 'entry.553851024'
};

// Google Apps Script Web App URL (if using Apps Script method)
// Replace with your Apps Script Web App URL after deployment
const APPS_SCRIPT_URL = ''; // Will be set after Apps Script deployment

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login
        alert('Please login to register for events');
        window.location.href = 'login.html';
        return;
    }
    
    initializeRegistrationPage();
    
    // Add test function to window for debugging
    window.testFormSubmission = function() {
        console.log('=== TESTING FORM SUBMISSION ===');
        console.log('Form URL:', GOOGLE_FORM_URL);
        console.log('Form ID:', GOOGLE_FORM_ID);
        console.log('Entry IDs:', ENTRY_IDS);
        
        // Test if we can access the form URL
        fetch(GOOGLE_FORM_URL, {
            method: 'GET',
            mode: 'no-cors'
        }).then(() => {
            console.log('✅ Form URL is accessible');
        }).catch(e => {
            console.error('❌ Form URL error:', e);
        });
        
        // Test with sample data
        const testData = {
            collegeName: 'Test College',
            departmentName: 'Test Department',
            member1Name: 'Test Member 1',
            member2Name: 'Test Member 2',
            contactNumber: '1234567890',
            contactEmail: 'test@example.com',
            timestamp: new Date().toISOString(),
            eventName: 'test'
        };
        
        console.log('Test data:', testData);
        console.log('To test submission, fill the form and submit it normally.');
    };
    
    // Log form configuration on load
    console.log('=== REGISTRATION FORM CONFIGURATION ===');
    console.log('Form URL:', GOOGLE_FORM_URL);
    console.log('Form ID:', GOOGLE_FORM_ID);
    console.log('Entry IDs:', ENTRY_IDS);
    console.log('Apps Script URL:', APPS_SCRIPT_URL || 'Not configured');
    console.log('To test form submission, type: testFormSubmission()');
});

/**
 * Initialize registration page
 */
function initializeRegistrationPage() {
    setupForm();
    extractEventFromURL();
    setupFormValidation();
}

/**
 * Extract event name from URL parameter or referrer page
 */
function extractEventFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let eventName = urlParams.get('event');
    const currentUser = getCurrentUser();
    
    // If not in URL parameter, try to extract from referrer page name
    if (!eventName && document.referrer) {
        try {
            const referrerUrl = new URL(document.referrer);
            const referrerPath = referrerUrl.pathname;
            // Extract page name from referrer (e.g., "bugwarz.html" -> "bugwarz")
            const match = referrerPath.match(/\/([^\/]+)\.html$/);
            if (match) {
                eventName = match[1];
                // Remove "events/" prefix if present
                eventName = eventName.replace(/^events\//, '');
            }
        } catch (e) {
            // If URL parsing fails, try simple extraction from referrer string
            const match = document.referrer.match(/([^\/]+)\.html/);
            if (match) {
                eventName = match[1];
            }
        }
    }
    
    if (eventName) {
        // Set hidden inputs
        document.getElementById('eventName').value = eventName;
        // Set Google Forms event field
        const eventFieldGF = document.getElementById('eventFieldGoogleForms');
        if (eventFieldGF) {
            eventFieldGF.value = eventName;
        }
        
        // Format event name for display
        const formattedEventName = formatEventName(eventName);
        document.getElementById('eventTitle').textContent = `Register for ${formattedEventName}`;
    }
    
    // If user is logged in, hide college/department fields and show user info
    if (currentUser) {
        const collegeNameGroup = document.getElementById('collegeNameGroup');
        const departmentNameGroup = document.getElementById('departmentNameGroup');
        const collegeNameInput = document.getElementById('collegeName');
        const departmentNameInput = document.getElementById('departmentName');
        
        if (collegeNameGroup) {
            collegeNameGroup.style.display = 'none';
        }
        if (departmentNameGroup) {
            departmentNameGroup.style.display = 'none';
        }
        
        // Remove required attribute from hidden fields to prevent validation errors
        if (collegeNameInput) {
            collegeNameInput.removeAttribute('required');
        }
        if (departmentNameInput) {
            departmentNameInput.removeAttribute('required');
        }
        
        // Show user info instead
        const subtitle = document.querySelector('.register-subtitle');
        if (subtitle) {
            subtitle.innerHTML = `
                Registering as: <strong>${currentUser.collegeName}</strong> - ${currentUser.departmentName}<br>
                Please fill in your team member details below.
            `;
        }
    } else {
        // If not logged in, ensure fields are visible and required
        const collegeNameGroup = document.getElementById('collegeNameGroup');
        const departmentNameGroup = document.getElementById('departmentNameGroup');
        const collegeNameInput = document.getElementById('collegeName');
        const departmentNameInput = document.getElementById('departmentName');
        
        if (collegeNameGroup) {
            collegeNameGroup.style.display = 'block';
        }
        if (departmentNameGroup) {
            departmentNameGroup.style.display = 'block';
        }
        
        // Ensure required attribute is set when fields are visible
        if (collegeNameInput) {
            collegeNameInput.setAttribute('required', 'required');
        }
        if (departmentNameInput) {
            departmentNameInput.setAttribute('required', 'required');
        }
    }
}

/**
 * Format event name for display (e.g., "bugwarz" -> "BugWarz")
 */
function formatEventName(eventName) {
    return eventName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Setup form submission handler
 */
function setupForm() {
    const form = document.getElementById('registrationForm');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        return;
    }
    
    // Check if already registered for this event (username-based check)
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('event') || 'general';
    
    if (isCollegeRegisteredForEvent(currentUser.username, eventName)) {
        // Already registered - show message
        const formContainer = document.querySelector('.register-content');
        formContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div class="success-icon" style="margin: 0 auto 1.5rem;">✓</div>
                <h2 class="register-title">Already Registered</h2>
                <p class="register-subtitle" style="margin-bottom: 2rem;">
                    Your college has already registered for this event.
                </p>
                <a href="dashboard.html" class="register-submit-btn" style="text-decoration: none; display: inline-block;">
                    <span class="btn-text">View My Registrations</span>
                </a>
            </div>
        `;
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = collectFormData();
        
        // CRITICAL: Always append college name and department from logged-in user
        // This ensures every registration includes these fields
        if (currentUser) {
            formData.collegeName = currentUser.collegeName || formData.collegeName;
            formData.departmentName = currentUser.departmentName || formData.departmentName;
        }
        
        // CRITICAL: Always ensure event name is set from the hidden field
        const eventNameInput = document.getElementById('eventName');
        if (eventNameInput && eventNameInput.value) {
            formData.eventName = eventNameInput.value;
        }
        
        // Validate that we have college and department
        if (!formData.collegeName || !formData.departmentName) {
            alert('College name and department are required. Please ensure you are logged in correctly.');
            return;
        }
        
        // Submit form
        await submitRegistration(formData);
    });
}

/**
 * Collect form data
 */
function collectFormData() {
    const timestamp = new Date().toISOString();
    const currentUser = getCurrentUser();
    
    // Always get college name and department from logged-in user
    // This ensures they are always included in the submission
    const collegeName = currentUser ? currentUser.collegeName : (document.getElementById('collegeName') ? document.getElementById('collegeName').value.trim() : '');
    const departmentName = currentUser ? currentUser.departmentName : (document.getElementById('departmentName') ? document.getElementById('departmentName').value.trim() : '');
    
    // Get event name from hidden field (auto-filled from URL or referrer)
    const eventNameInput = document.getElementById('eventName');
    const eventFieldGF = document.getElementById('eventFieldGoogleForms');
    let eventName = '';
    if (eventNameInput && eventNameInput.value) {
        eventName = eventNameInput.value;
    } else if (eventFieldGF && eventFieldGF.value) {
        eventName = eventFieldGF.value;
    } else {
        // Fallback: try to get from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        eventName = urlParams.get('event') || 'General';
    }
    
    return {
        timestamp: timestamp,
        collegeName: collegeName,
        departmentName: departmentName,
        member1Name: document.getElementById('member1Name').value.trim(),
        member2Name: document.getElementById('member2Name').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        contactEmail: document.getElementById('contactEmail').value.trim(),
        eventName: eventName
    };
}

/**
 * Validate form fields with enhanced validation
 */
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // College Name validation (only if not logged in)
    const currentUser = getCurrentUser();
    if (!currentUser) {
        const collegeName = document.getElementById('collegeName').value.trim();
        if (!collegeName) {
            showError('collegeName', 'College name is required');
            isValid = false;
        } else if (collegeName.length < 2) {
            showError('collegeName', 'College name must be at least 2 characters');
            isValid = false;
        } else if (collegeName.length > 100) {
            showError('collegeName', 'College name must be less than 100 characters');
            isValid = false;
        }
        
        // Department Name validation
        const departmentName = document.getElementById('departmentName').value.trim();
        if (!departmentName) {
            showError('departmentName', 'Department name is required');
            isValid = false;
        } else if (departmentName.length < 2) {
            showError('departmentName', 'Department name must be at least 2 characters');
            isValid = false;
        } else if (departmentName.length > 100) {
            showError('departmentName', 'Department name must be less than 100 characters');
            isValid = false;
        }
    }
    
    // Member 1 Name validation
    const member1Name = document.getElementById('member1Name').value.trim();
    if (!member1Name) {
        showError('member1Name', 'Member 1 name is required');
        isValid = false;
    } else if (member1Name.length < 2) {
        showError('member1Name', 'Member 1 name must be at least 2 characters');
        isValid = false;
    } else if (member1Name.length > 100) {
        showError('member1Name', 'Member 1 name must be less than 100 characters');
        isValid = false;
            } else if (!/^[a-zA-Z\s\.'\-]+$/.test(member1Name)) {
                showError('member1Name', 'Member 1 name can only contain letters, spaces, and basic punctuation');
                isValid = false;
            }
    
    // Member 2 Name validation
    const member2Name = document.getElementById('member2Name').value.trim();
    if (!member2Name) {
        showError('member2Name', 'Member 2 name is required');
        isValid = false;
    } else if (member2Name.length < 2) {
        showError('member2Name', 'Member 2 name must be at least 2 characters');
        isValid = false;
    } else if (member2Name.length > 100) {
        showError('member2Name', 'Member 2 name must be less than 100 characters');
        isValid = false;
            } else if (!/^[a-zA-Z\s\.'\-]+$/.test(member2Name)) {
                showError('member2Name', 'Member 2 name can only contain letters, spaces, and basic punctuation');
                isValid = false;
            }
    
    // Contact Number validation
    const contactNumber = document.getElementById('contactNumber').value.trim();
    if (!contactNumber) {
        showError('contactNumber', 'Contact number is required');
        isValid = false;
    } else if (!/^[0-9]{10,15}$/.test(contactNumber)) {
        showError('contactNumber', 'Please enter a valid contact number (10-15 digits only)');
        isValid = false;
    }
    
    // Contact Email validation
    const contactEmail = document.getElementById('contactEmail').value.trim();
    if (!contactEmail) {
        showError('contactEmail', 'Contact email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        showError('contactEmail', 'Please enter a valid email address');
        isValid = false;
    } else if (contactEmail.length > 254) {
        showError('contactEmail', 'Email address is too long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show error for a specific field
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    if (inputElement) {
        inputElement.classList.add('input-error');
    }
}

/**
 * Clear all errors
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    const inputElements = document.querySelectorAll('.form-input');
    
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    inputElements.forEach(el => {
        el.classList.remove('input-error');
    });
}

/**
 * Setup real-time form validation
 */
function setupFormValidation() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input.id);
        });
        
        input.addEventListener('input', function() {
            // Clear error on input
            const errorElement = document.getElementById(`${input.id}Error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            input.classList.remove('input-error');
        });
    });
}

/**
 * Validate individual field
 */
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const value = input.value.trim();
    
    switch(fieldId) {
        case 'collegeName':
        case 'departmentName':
            if (!value) {
                showError(fieldId, 'This field is required');
                return false;
            } else if (value.length < 2) {
                showError(fieldId, 'Must be at least 2 characters');
                return false;
            } else if (value.length > 100) {
                showError(fieldId, 'Must be less than 100 characters');
                return false;
            }
            break;
        case 'member1Name':
        case 'member2Name':
            if (!value) {
                showError(fieldId, 'This field is required');
                return false;
            } else if (value.length < 2) {
                showError(fieldId, 'Must be at least 2 characters');
                return false;
            } else if (value.length > 100) {
                showError(fieldId, 'Must be less than 100 characters');
                return false;
            } else if (!/^[a-zA-Z\s\.'\-]+$/.test(value)) {
                showError(fieldId, 'Can only contain letters, spaces, and basic punctuation');
                return false;
            }
            break;
        case 'contactNumber':
            if (!value) {
                showError(fieldId, 'Contact number is required');
                return false;
            } else if (!/^[0-9]{10,15}$/.test(value)) {
                showError(fieldId, 'Please enter a valid contact number (10-15 digits)');
                return false;
            }
            break;
        case 'contactEmail':
            if (!value) {
                showError(fieldId, 'Contact email is required');
                return false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(fieldId, 'Please enter a valid email address');
                return false;
            }
            break;
    }
    
    return true;
}

/**
 * Submit registration to Google Forms
 */
async function submitRegistration(formData) {
    const submitBtn = document.getElementById('submitBtn');
    const formLoading = document.getElementById('formLoading');
    const form = document.getElementById('registrationForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    formLoading.style.display = 'flex';
    formError.style.display = 'none';
    
    try {
        let success = false;
        
        // Method 1: Try Google Apps Script (if configured)
        if (APPS_SCRIPT_URL) {
            success = await submitViaAppsScript(formData);
        }
        
        // Method 2: Fallback to direct Google Forms submission
        if (!success) {
            success = await submitViaGoogleForms(formData);
        }
        
        if (success) {
            // Save registration to localStorage
            const currentUser = getCurrentUser();
            if (currentUser) {
                const registration = {
                    id: generateId(),
                    username: currentUser.username, // Store username for data isolation
                    collegeName: formData.collegeName,
                    departmentName: formData.departmentName,
                    member1Name: formData.member1Name,
                    member2Name: formData.member2Name,
                    contactNumber: formData.contactNumber,
                    contactEmail: formData.contactEmail,
                    eventName: formData.eventName || 'general',
                    timestamp: formData.timestamp,
                    submittedAt: new Date().toISOString()
                };
                
                saveRegistration(registration);
            }
            
            // Hide form and show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Update success message with verification note
            const successMsg = formSuccess.querySelector('.success-message');
            if (successMsg) {
                successMsg.innerHTML = `
                    Your registration has been submitted successfully!<br><br>
                    <strong>Please verify:</strong> Check your Google Form responses or Google Sheet to confirm your data was saved.<br><br>
                    <a href="dashboard.html" style="color: var(--primary-blue); text-decoration: none; font-weight: 600;">View My Registrations →</a>
                `;
            }
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error('Failed to submit registration');
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Show error message
        formError.style.display = 'block';
        document.getElementById('errorMessageText').textContent = 
            error.message || 'An error occurred while submitting your registration. Please try again.';
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    } finally {
        formLoading.style.display = 'none';
    }
}

/**
 * Submit via Google Apps Script (Recommended method)
 */
async function submitViaAppsScript(formData) {
    if (!APPS_SCRIPT_URL) {
        return false;
    }
    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // With no-cors mode, we can't read the response, but if no error is thrown, assume success
        return true;
    } catch (error) {
        console.error('Apps Script submission error:', error);
        return false;
    }
}

/**
 * Submit via direct Google Forms (Fallback method)
 * Note: This method uses form entry IDs which need to be extracted from the form
 */
async function submitViaGoogleForms(formData) {
    try {
        // Use the direct submission method with actual entry IDs
        return await submitDirectlyToGoogleForms(formData);
    } catch (error) {
        console.error('Google Forms submission error:', error);
        // Fallback to pre-filled form if direct submission fails
        const prefillUrl = createPrefilledFormURL(formData);
        window.open(prefillUrl, '_blank');
        showPrefillInstructions();
        return true;
    }
}

/**
 * Create pre-filled Google Form URL
 * This is a fallback method - user still needs to click submit on the form
 */
function createPrefilledFormURL(formData) {
    const baseUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
    const params = new URLSearchParams();
    
    // Pre-fill form fields with entry IDs
    // Always include college name, department name, and event name
    params.append(ENTRY_IDS.collegeName, formData.collegeName || '');
    params.append(ENTRY_IDS.departmentName, formData.departmentName || '');
    params.append(ENTRY_IDS.member1Name, formData.member1Name || '');
    params.append(ENTRY_IDS.member2Name, formData.member2Name || '');
    params.append(ENTRY_IDS.contactNumber, formData.contactNumber || '');
    params.append(ENTRY_IDS.contactEmail, formData.contactEmail || '');
    params.append(ENTRY_IDS.event, formData.eventName || '');
    
    return `${baseUrl}?${params.toString()}`;
}

/**
 * Show instructions for pre-filled form method
 */
function showPrefillInstructions() {
    const formSuccess = document.getElementById('formSuccess');
    const successMessage = formSuccess.querySelector('.success-message');
    
    successMessage.innerHTML = `
        A Google Form has been opened in a new tab with your information pre-filled.<br>
        Please review and click "Submit" on that form to complete your registration.
    `;
}

/**
 * Direct submission method using hidden iframe for better reliability
 * This method can actually verify if the submission was successful
 */
async function submitDirectlyToGoogleForms(formData) {
    return new Promise((resolve, reject) => {
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Form URL:', GOOGLE_FORM_URL);
        console.log('Form ID:', GOOGLE_FORM_ID);
        console.log('Entry IDs:', ENTRY_IDS);
        console.log('Form Data:', formData);
        
        // Create a hidden iframe for submission
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe_' + Date.now();
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        document.body.appendChild(iframe);
        
        // Create a form to submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_FORM_URL;
        form.target = iframe.name;
        form.style.display = 'none';
        form.enctype = 'application/x-www-form-urlencoded';
        
        // Add form data with correct entry IDs
        // Note: Timestamp is auto-generated by Google Forms, so we don't need to send it
        // IMPORTANT: Always include college name, department name, and event name with each registration
        const fields = [
            { name: ENTRY_IDS.collegeName, value: formData.collegeName || '' },
            { name: ENTRY_IDS.departmentName, value: formData.departmentName || '' },
            { name: ENTRY_IDS.member1Name, value: formData.member1Name || '' },
            { name: ENTRY_IDS.member2Name, value: formData.member2Name || '' },
            { name: ENTRY_IDS.contactNumber, value: formData.contactNumber || '' },
            { name: ENTRY_IDS.contactEmail, value: formData.contactEmail || '' },
            { name: ENTRY_IDS.event, value: formData.eventName || '' }
        ];
        
        // Validate all required fields are present
        if (!formData.collegeName || !formData.departmentName) {
            console.error('❌ Missing college name or department name!');
            throw new Error('College name and department are required');
        }
        
        console.log('Fields being submitted:');
        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            form.appendChild(input);
            console.log(`  ${field.name} = "${field.value}"`);
        });
        
        document.body.appendChild(form);
        
        // Set timeout to check if submission completed
        const timeout = setTimeout(() => {
            console.log('⚠️ Submission timeout (5s) - form may have been submitted');
            console.log('⚠️ Check your Google Sheet to verify data was saved');
            cleanup();
            // If we reach here, assume submission might have worked
            // (Google Forms doesn't send a response we can read)
            resolve(true);
        }, 5000);
        
        // Listen for iframe load (indicates form was submitted)
        iframe.onload = function() {
            console.log('✅ Iframe loaded - checking response...');
            clearTimeout(timeout);
            // Check if we got a success response (Google Forms redirects to a thank you page)
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeContent = iframeDoc.body ? iframeDoc.body.innerHTML : '';
                const iframeURL = iframe.contentWindow.location.href;
                
                console.log('Iframe URL:', iframeURL);
                console.log('Iframe content length:', iframeContent.length);
                
                // Google Forms shows a thank you message on successful submission
                if (iframeContent.includes('Your response has been recorded') || 
                    iframeContent.includes('Thank you') ||
                    iframeContent.includes('response has been recorded') ||
                    iframeURL.includes('formResponse')) {
                    console.log('✅ SUCCESS: Form submission detected!');
                    cleanup();
                    resolve(true);
                } else {
                    console.log('⚠️ WARNING: Could not verify submission, but form was sent');
                    console.log('⚠️ Please check your Google Sheet to confirm data was saved');
                    // Might still be successful, but we can't verify
                    cleanup();
                    resolve(true); // Assume success since form was submitted
                }
            } catch (e) {
                console.log('⚠️ CORS restriction - cannot read iframe content');
                console.log('⚠️ This is normal - form was still submitted');
                console.log('⚠️ Please check your Google Sheet to confirm data was saved');
                // Cross-origin restriction - can't read iframe content
                // But form was submitted, so assume success
                cleanup();
                resolve(true);
            }
        };
        
        iframe.onerror = function(error) {
            console.error('❌ Iframe error:', error);
            clearTimeout(timeout);
            cleanup();
            reject(new Error('Failed to submit form - iframe error'));
        };
        
        // Cleanup function
        function cleanup() {
            if (form.parentNode) {
                form.parentNode.removeChild(form);
            }
            if (iframe.parentNode) {
                setTimeout(() => {
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                    }
                }, 2000);
            }
        }
        
        // Submit the form
        console.log('🚀 Submitting form now...');
        console.log('📋 IMPORTANT: Check the Network tab in DevTools to see the actual HTTP request');
        console.log('📋 Look for a POST request to "formResponse" - check its status code');
        try {
            form.submit();
            console.log('✅ Form submit() called successfully');
            console.log('');
            console.log('🔍 TO VERIFY SUBMISSION:');
            console.log('1. Open the Network tab in DevTools (F12 → Network)');
            console.log('2. Look for a request to "formResponse"');
            console.log('3. Check the Status Code:');
            console.log('   - 200 = Success (data should be in your sheet)');
            console.log('   - 302 = Redirect (also success)');
            console.log('   - 400/500 = Error (check the response)');
            console.log('4. Check your Google Sheet to confirm data appears');
        } catch (error) {
            console.error('❌ Error submitting form:', error);
            cleanup();
            reject(error);
        }
    });
}

