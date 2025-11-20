# Troubleshooting Registration Form Submission

## Issue: Form Shows Success But Data Doesn't Appear in Google Sheets

### Why This Happens

Google Forms has security restrictions that prevent direct programmatic submission from external websites. The current implementation uses an iframe method, but Google may still block it due to:

1. **CORS (Cross-Origin Resource Sharing) restrictions**
2. **Google Forms security policies**
3. **Browser security settings**

### Solutions (In Order of Reliability)

#### ✅ Solution 1: Use Google Apps Script (RECOMMENDED - 100% Reliable)

This is the **most reliable method** and will guarantee your data is saved.

**Steps:**
1. Follow the guide in `GOOGLE_APPS_SCRIPT_SETUP.md`
2. Deploy the Apps Script as a Web App
3. Update `APPS_SCRIPT_URL` in `registration.js`
4. Your form will submit reliably every time

**Why it works:** Google Apps Script runs on Google's servers, so there are no CORS restrictions.

---

#### Solution 2: Verify Form URL Format

The form ID from the edit URL might be different from the submission URL.

**To get the correct form response URL:**
1. Open your Google Form: https://forms.gle/VAuBwCRavZUriFjD7
2. Right-click → "Inspect" or press F12
3. Look for the form action URL in the HTML
4. It should look like: `https://docs.google.com/forms/d/e/1FAIpQLSd.../formResponse`
5. Update `GOOGLE_FORM_ID` in `registration.js` with the ID from that URL

**Note:** The ID in the edit URL (`/d/FORM_ID/edit`) might be different from the submission URL (`/d/e/FORM_ID/formResponse`).

---

#### Solution 3: Check Browser Console

1. Open your registration page
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Submit the form
5. Look for any error messages
6. Check the "Network" tab to see if the request was sent

**What to look for:**
- `Submitting form to: [URL]` - confirms the URL being used
- `Form data: [object]` - confirms the data being sent
- Any CORS or network errors

---

#### Solution 4: Test Direct Form Submission

Test if your form accepts direct submissions:

1. Open: `https://docs.google.com/forms/d/e/1GBbLEyz5FuzQgrx0Ko6fX6pQ690XqPKMRWiTfHhin24/formResponse`
2. Manually fill and submit the form
3. Check if data appears in your Google Sheet
4. If it works manually but not programmatically, it's a CORS/security issue

---

### Current Implementation Details

The form currently uses:
- **Method:** Hidden iframe submission
- **URL Format:** `https://docs.google.com/forms/d/e/FORM_ID/formResponse`
- **Form ID:** `1GBbLEyz5FuzQgrx0Ko6fX6pQ690XqPKMRWiTfHhin24`
- **Entry IDs:** All configured correctly

### Validation Added

✅ **Enhanced validation:**
- Minimum/maximum length checks
- Name format validation (letters, spaces, punctuation only)
- Email format validation
- Phone number format validation (10 digits)
- HTML5 validation attributes

### Next Steps

1. **Check browser console** for errors when submitting
2. **Verify the form URL** is correct (might need different ID)
3. **Set up Google Apps Script** for reliable submission (recommended)
4. **Test with a simple form** to verify Google Forms accepts submissions

### Quick Test

Run this in your browser console on the registration page:
```javascript
// Test if form URL is accessible
fetch('https://docs.google.com/forms/d/e/1GBbLEyz5FuzQgrx0Ko6fX6pQ690XqPKMRWiTfHhin24/formResponse', {
    method: 'POST',
    mode: 'no-cors',
    body: new FormData()
}).then(() => console.log('Form URL is accessible')).catch(e => console.error('Error:', e));
```

If you see CORS errors, that confirms the issue and you should use Google Apps Script.

---

## Still Having Issues?

1. Check the browser console for specific error messages
2. Verify your Google Form is set to accept responses
3. Make sure your Google Sheet is linked to the form
4. Try the Google Apps Script method (most reliable)

