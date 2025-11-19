# Google Apps Script Setup Guide

This guide will help you set up Google Apps Script to automatically submit form data to your Google Form and save it to Google Sheets.

## Method 1: Google Apps Script (Recommended - Automatic Submission)

### Step 1: Get Your Google Form Entry IDs

1. Open your Google Form: https://forms.gle/VAuBwCRavZUriFjD7
2. Right-click on the form and select "Inspect" (or press F12)
3. In the browser console, run this JavaScript code:
   ```javascript
   // Get all entry IDs from the form
   const inputs = document.querySelectorAll('input[name^="entry."]');
   inputs.forEach(input => {
       const label = input.closest('.freebirdFormviewerViewItemsItemItem')?.querySelector('.freebirdFormviewerViewItemsItemItemTitle')?.textContent;
       console.log(`${label || 'Unknown'}: ${input.name}`);
   });
   ```
4. Note down the entry IDs for each field:
   - Timestamp: `entry.XXXXXXXXX`
   - COLLEGE NAME: `entry.XXXXXXXXX`
   - DEPARTMENT NAME: `entry.XXXXXXXXX`
   - MEMBER 1 - NAME: `entry.XXXXXXXXX`
   - MEMBER 2 - NAME: `entry.XXXXXXXXX`
   - CONTACT NUMBER: `entry.XXXXXXXXX`
   - CONTACT EMAIL: `entry.XXXXXXXXX`

### Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the default code with the following:

```javascript
/**
 * Tech Rodeo Registration Form Handler
 * Receives form data and submits to Google Form
 */

// Replace these with your actual Google Form entry IDs
const ENTRY_IDS = {
  timestamp: 'entry.XXXXXXXXX',      // Replace with Timestamp entry ID
  collegeName: 'entry.XXXXXXXXX',    // Replace with COLLEGE NAME entry ID
  departmentName: 'entry.XXXXXXXXX', // Replace with DEPARTMENT NAME entry ID
  member1Name: 'entry.XXXXXXXXX',   // Replace with MEMBER 1 - NAME entry ID
  member2Name: 'entry.XXXXXXXXX',    // Replace with MEMBER 2 - NAME entry ID
  contactNumber: 'entry.XXXXXXXXX',  // Replace with CONTACT NUMBER entry ID
  contactEmail: 'entry.XXXXXXXXX'    // Replace with CONTACT EMAIL entry ID
};

// Replace with your Google Form ID (extract from form URL)
const FORM_ID = 'VAuBwCRavZUriFjD7'; // From https://forms.gle/VAuBwCRavZUriFjD7
const FORM_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

/**
 * Handle POST request from registration form
 */
function doPost(e) {
  try {
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Create form data for submission
    const formData = new FormData();
    
    // Map data to Google Form entry IDs
    if (ENTRY_IDS.timestamp) {
      formData.append(ENTRY_IDS.timestamp, data.timestamp || new Date().toISOString());
    }
    if (ENTRY_IDS.collegeName) {
      formData.append(ENTRY_IDS.collegeName, data.collegeName);
    }
    if (ENTRY_IDS.departmentName) {
      formData.append(ENTRY_IDS.departmentName, data.departmentName);
    }
    if (ENTRY_IDS.member1Name) {
      formData.append(ENTRY_IDS.member1Name, data.member1Name);
    }
    if (ENTRY_IDS.member2Name) {
      formData.append(ENTRY_IDS.member2Name, data.member2Name);
    }
    if (ENTRY_IDS.contactNumber) {
      formData.append(ENTRY_IDS.contactNumber, data.contactNumber);
    }
    if (ENTRY_IDS.contactEmail) {
      formData.append(ENTRY_IDS.contactEmail, data.contactEmail);
    }
    
    // Submit to Google Form
    const response = UrlFetchApp.fetch(FORM_URL, {
      method: 'post',
      payload: formData
    });
    
    // Also write directly to Google Sheets (if form responses go to a sheet)
    writeToSheet(data);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Write data directly to Google Sheets
 * This is a backup method in case form submission fails
 */
function writeToSheet(data) {
  try {
    // Get the spreadsheet ID from your Google Form responses
    // To find it: Open your form → Responses → Click the Sheets icon
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your spreadsheet ID
    
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      return; // Skip if not configured
    }
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Append row with data
    sheet.appendRow([
      data.timestamp || new Date(),
      data.collegeName,
      data.departmentName,
      data.member1Name,
      data.member2Name,
      data.contactNumber,
      data.contactEmail,
      data.eventName || 'General'
    ]);
  } catch (error) {
    console.error('Error writing to sheet:', error);
    // Don't throw - this is optional
  }
}

/**
 * Handle GET request (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput('Tech Rodeo Registration API is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### Step 3: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Select type" and choose "Web app"
3. Set the following:
   - **Description**: Tech Rodeo Registration API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/...`)
6. Open `registration.js` and paste this URL into the `APPS_SCRIPT_URL` constant

### Step 4: Update registration.js

1. Open `registration.js`
2. Find the line: `const APPS_SCRIPT_URL = '';`
3. Replace with your Web App URL:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### Step 5: Update Entry IDs

1. In the Apps Script code, replace all `entry.XXXXXXXXX` with your actual entry IDs from Step 1
2. Save the script
3. The script will automatically update when you deploy

---

## Method 2: Direct Google Forms Submission (Alternative)

If you prefer not to use Apps Script, you can extract entry IDs and submit directly. However, this method has CORS limitations and may not work reliably.

### Steps:

1. Extract entry IDs (same as Step 1 above)
2. Open `registration.js`
3. Find the `submitDirectlyToGoogleForms` function
4. Update the `entryIds` object with your actual entry IDs
5. The form will attempt to submit directly to Google Forms

**Note**: This method may be blocked by CORS policies. Apps Script is recommended for production use.

---

## Testing

1. Open your registration page: `register.html?event=bugwarz`
2. Fill in the form
3. Submit
4. Check your Google Form responses or Google Sheet to verify the data was saved

---

## Troubleshooting

### Issue: "Failed to submit registration"
- Check that your Apps Script URL is correct
- Verify entry IDs match your Google Form
- Check Apps Script execution logs: View → Executions

### Issue: Data not appearing in Google Sheets
- Verify your spreadsheet ID is correct in the `writeToSheet` function
- Check that your Google Form is linked to a Google Sheet
- Ensure the Apps Script has permission to access the spreadsheet

### Issue: CORS errors
- Make sure you're using the Apps Script method (not direct submission)
- Verify the Apps Script deployment has "Anyone" access

---

## Security Notes

- The Apps Script Web App is set to "Anyone" access, which means it's publicly accessible
- Consider adding basic validation or rate limiting in production
- The form data is sent over HTTPS, so it's encrypted in transit
- Google Forms automatically handles spam protection

