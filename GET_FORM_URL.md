# How to Get the Correct Google Form Submission URL

## The Problem

The form ID from the **edit URL** (`/d/FORM_ID/edit`) is **different** from the **submission URL** (`/d/e/FORM_ID/formResponse`).

Your edit URL: `https://docs.google.com/forms/d/1GBbLEyz5FuzQgrx0Ko6fX6pQ690XqPKMRWiTfHhin24/edit`

But the submission URL might be different!

## How to Find the Correct Submission URL

### Method 1: From the Form View Page (Easiest)

1. Open your Google Form: https://forms.gle/VAuBwCRavZUriFjD7
2. Right-click anywhere on the form → **"Inspect"** (or press **F12**)
3. In the Elements/Inspector tab, press **Ctrl+F** (or Cmd+F on Mac) to search
4. Search for: `formResponse` or `action=`
5. You'll see something like:
   ```html
   <form action="https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXX/formResponse" ...>
   ```
6. Copy the ID from that URL (the part after `/d/e/` and before `/formResponse`)
7. That's your correct form ID!

### Method 2: From Network Tab

1. Open your Google Form: https://forms.gle/VAuBwCRavZUriFjD7
2. Press **F12** to open Developer Tools
3. Go to the **Network** tab
4. Fill out and submit the form manually
5. Look for a request to `formResponse`
6. The URL will show the correct form ID

### Method 3: Check the Short URL

1. The short URL `https://forms.gle/VAuBwCRavZUriFjD7` redirects to the actual form
2. When it redirects, check the URL in the address bar
3. It should show: `https://docs.google.com/forms/d/e/FORM_ID/viewform`
4. Copy the `FORM_ID` from that URL

## Update Your Code

Once you have the correct form ID:

1. Open `registration.js`
2. Find this line:
   ```javascript
   const GOOGLE_FORM_ID = '1GBbLEyz5FuzQgrx0Ko6fX6pQ690XqPKMRWiTfHhin24';
   ```
3. Replace it with the correct form ID you found
4. Save the file

## Test It

1. Open your registration page
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. You should see:
   ```
   === REGISTRATION FORM CONFIGURATION ===
   Form URL: https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
   ```
5. Submit the form and check the console for detailed logs
6. Check your Google Sheet to see if data appears

## Why This Matters

Google Forms uses **two different IDs**:
- **Edit ID**: Used for editing the form (`/d/FORM_ID/edit`)
- **Submission ID**: Used for submitting responses (`/d/e/FORM_ID/formResponse`)

If you use the wrong ID, the form submission will fail silently!

## Still Not Working?

If you've verified the form ID is correct and data still doesn't appear:

1. **Use Google Apps Script** - This is the most reliable method (see `GOOGLE_APPS_SCRIPT_SETUP.md`)
2. **Check browser console** - Look for CORS errors or network errors
3. **Test manually** - Submit the form manually to verify it works
4. **Check form settings** - Make sure your Google Form accepts responses

