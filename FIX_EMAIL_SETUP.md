# Fix Email Service Setup

## Current Issue
The email service is failing due to Gmail authentication error: "Invalid login: 535-5.7.8 Username and Password not accepted"

## Solution: Generate a Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification"
4. Follow the on-screen instructions to set it up

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app type
3. Select "Other (Custom name)" as the device type
4. Enter "AMS System" as the name
5. Click "Generate"
6. Copy the 16-character password (like: `qvegnvsxixealfsq`)

### Step 3: Update Your Server.js
Replace the old password in `server.js`:
```javascript
process.env.SMTP_PASS = process.env.SMTP_PASS || 'YOUR_NEW_16_CHAR_APP_PASSWORD';
```

### Alternative: Use a .env File (Recommended)
1. Create a `.env` file in the project root
2. Add:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sankancharl619@gmail.com
SMTP_PASS=YOUR_NEW_APP_PASSWORD
SCHOOL_FROM_EMAIL=sankancharl619@gmail.com
```

## Status Check
- ✅ **WhatsApp**: Ready and working
- ❌ **Email**: Needs valid Gmail App Password

After updating the password, restart the server.




