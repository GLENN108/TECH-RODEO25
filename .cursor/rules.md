# Project Rules and Guidelines

## Code Style
- Use vanilla JavaScript (no frameworks)
- Follow existing code patterns
- Maintain consistent naming conventions
- Use localStorage for data persistence

## Business Rules
1. **One account per college** - Enforced strictly
2. **One team per college per event** - Cannot register twice for same event
3. **Can register for multiple events** - One registration per event allowed
4. **College info auto-filled** - From logged-in user account

## File Organization
- Authentication: `auth.js`, `login.html`, `register-user.html`
- Registration: `register.html`, `registration.js`
- Dashboard: `dashboard.html`, `dashboard.js`
- Admin: `admin.html`, `admin.js`
- Events: `events.html`, `events/*.html`

## Security Notes
- Passwords are hashed (simple hash - upgrade for production)
- Admin panel requires authentication
- Registration requires user login
- No sensitive data in code (all in localStorage)

## Google Forms Integration
- Form ID must match submission URL
- Entry IDs must match form fields
- Form must be linked to Google Sheet for data to appear
- Use Apps Script for more reliable submission (optional)

## Data Storage
- All data stored in browser localStorage
- Data persists across sessions
- Can be cleared by user clearing browser data
- For production, migrate to server-side database

