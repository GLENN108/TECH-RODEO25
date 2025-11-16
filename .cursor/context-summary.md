# Tech Rodeo - Project Context Summary

## Project Overview
A complete event registration system for Tech Rodeo event at Loyola College, Department of Data Science. The system includes user authentication, event registration with Google Forms integration, student dashboard, and admin panel.

## Core Components

### 1. Authentication System (`auth.js`)
- **Storage Keys:**
  - `tech_rodeo_users` - All registered users
  - `tech_rodeo_current_user` - Current session
  - `tech_rodeo_registrations` - All event registrations
  - `tech_rodeo_admin` - Admin credentials

- **Key Functions:**
  - `registerUser()` - Register new college account
  - `loginUser()` - Student login
  - `loginAdmin()` - Admin login
  - `logoutUser()` - Logout
  - `isCollegeRegisteredForEvent()` - Check duplicate registration
  - `saveRegistration()` - Save event registration

- **Admin Credentials:**
  - Username: `admin`
  - Password: `admin123` (default, should be changed)

### 2. Registration System (`registration.js`)
- **Google Forms Configuration:**
  - Form ID: `1FAIpQLSdZh26G3X0UBjm1UlmpUwpshVB1jcNMbxnVCZrJg0eB73kMmw`
  - Form URL: `https://docs.google.com/forms/d/e/1FAIpQLSdZh26G3X0UBjm1UlmpUwpshVB1jcNMbxnVCZrJg0eB73kMmw/formResponse`

- **Entry IDs:**
  - College Name: `entry.1722691925`
  - Department Name: `entry.1244501594`
  - Member 1 Name: `entry.1619849414`
  - Member 2 Name: `entry.1020210834`
  - Contact Number: `entry.306300074`
  - Contact Email: `entry.308774662`

- **Features:**
  - Requires user login
  - Prevents duplicate registrations (one team per college per event)
  - Auto-fills college/department from logged-in user
  - Submits to Google Forms + saves to localStorage
  - Reusable for all events via URL parameter: `?event=eventname`

### 3. Events
All events use the same registration form:
- `hackverse`
- `viswiz`
- `iqverse`
- `datawear`
- `rodeihunt`
- `datafusion`
- `profusion`
- `pitchstorm`

### 4. Business Rules
- **One account per college** - Enforced at registration
- **One team per college per event** - Enforced at event registration
- **Can register for multiple events** - One registration per event
- **College/Department auto-filled** - From logged-in user account

### 5. Data Flow
1. User registers account → Saved to localStorage
2. User logs in → Session created
3. User browses events → Clicks register
4. System checks: Already registered? → Show message
5. If not: Show form (college pre-filled) → Submit
6. Data saved to: Google Forms + localStorage
7. User can view in dashboard

### 6. File Dependencies
- All pages need `auth.js` for authentication
- Registration pages need `registration.js`
- Dashboard needs `dashboard.js`
- Admin needs `admin.js`
- All pages use `style.css`

## Important Notes
- Uses localStorage (browser storage) - data persists in browser
- Google Forms integration requires form to be linked to Google Sheet
- Admin panel is protected with login
- Registration form is reusable - works for all events automatically

