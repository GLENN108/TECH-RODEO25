# Tech Rodeo Registration System

A reusable registration form that integrates with Google Forms to automatically collect and submit registration data.

## Files Created

1. **`register.html`** - The registration form page
2. **`registration.js`** - JavaScript handler for form submission and Google Forms integration
3. **`extract-entry-ids.html`** - Helper tool to extract Google Form entry IDs
4. **`GOOGLE_APPS_SCRIPT_SETUP.md`** - Complete setup guide for Google Apps Script integration

## Features

✅ **Reusable Registration Form** - Works for all events with dynamic event name from URL parameter  
✅ **Form Validation** - Client-side validation for all required fields  
✅ **Google Forms Integration** - Automatic submission to Google Forms  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Error Handling** - User-friendly error messages and success notifications  
✅ **Event Tracking** - Captures which event the user is registering for  

## Form Fields

The registration form collects the following information (all required):

- **College Name** - Text input
- **Department Name** - Text input  
- **Member 1 - Name** - Text input
- **Member 2 - Name** - Text input
- **Contact Number** - Phone number (10-15 digits)
- **Contact Email** - Email address

**Note:** Timestamp is automatically generated when the form is submitted.

## How to Use

### For Users

1. Navigate to any event detail page (e.g., `events/bugwarz.html`)
2. Click the "Register for [Event Name]" button
3. Fill in all required fields
4. Click "Submit Registration"
5. Wait for confirmation message

### For Developers

#### Quick Start

1. **Extract Google Form Entry IDs:**
   - Open `extract-entry-ids.html` in a browser
   - Follow the instructions to extract entry IDs from your Google Form
   - Copy the generated JavaScript object

2. **Set Up Google Apps Script (Recommended):**
   - Follow the detailed guide in `GOOGLE_APPS_SCRIPT_SETUP.md`
   - Deploy the Apps Script as a Web App
   - Update `APPS_SCRIPT_URL` in `registration.js`

3. **Alternative: Direct Submission:**
   - Update the `entryIds` object in `registration.js` with your extracted entry IDs
   - The form will attempt to submit directly to Google Forms

## URL Parameters

The registration page accepts an `event` parameter in the URL:

```
register.html?event=bugwarz
register.html?event=viswiz
register.html?event=iqverse
```

This automatically:
- Sets the event name in the form
- Updates the page title to show which event is being registered for

## Integration Points

### Event Detail Pages

All event detail pages have been updated to link to the registration page:

- `events/bugwarz.html` → `register.html?event=bugwarz`
- `events/viswiz.html` → `register.html?event=viswiz`
- `events/iqverse.html` → `register.html?event=iqverse`
- `events/datawear.html` → `register.html?event=datawear`
- `events/rodeohunt.html` → `register.html?event=rodeohunt`
- `events/datafusion.html` → `register.html?event=datafusion`
- `events/profusion.html` → `register.html?event=profusion`
- `events/pitchstorm.html` → `register.html?event=pitchstorm`

## Google Form Configuration

Your Google Form URL: https://forms.gle/VAuBwCRavZUriFjD7

**Form Fields (in order):**
1. Timestamp (auto-generated)
2. COLLEGE NAME
3. DEPARTMENT NAME
4. MEMBER 1 - NAME
5. MEMBER 2 - NAME
6. CONTACT NUMBER
7. CONTACT EMAIL

## Testing

1. Open `register.html?event=bugwarz` in your browser
2. Fill in the form with test data
3. Submit the form
4. Check your Google Form responses or Google Sheet to verify the data was saved

## Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify Google Apps Script URL is correct (if using Apps Script method)
- Ensure entry IDs match your Google Form

### Data not appearing in Google Sheets?
- Verify your Google Form is linked to a Google Sheet
- Check Apps Script execution logs
- Ensure spreadsheet ID is correct in Apps Script code

### Entry IDs not found?
- Use the `extract-entry-ids.html` helper tool
- Follow the instructions in `GOOGLE_APPS_SCRIPT_SETUP.md`

## Next Steps

1. ✅ Extract entry IDs from your Google Form
2. ✅ Set up Google Apps Script (recommended) or configure direct submission
3. ✅ Test the registration flow
4. ✅ Verify data appears in Google Sheets
5. ✅ Deploy to production

## Support

For detailed setup instructions, see `GOOGLE_APPS_SCRIPT_SETUP.md`.

