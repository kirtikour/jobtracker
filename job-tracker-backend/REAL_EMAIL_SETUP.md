# Real Email Setup for Password Reset

## Quick Setup Guide

Your email system is already configured! To use real emails instead of test emails, follow these steps:

### Step 1: Create Environment File

Create a `.env` file in the `job-tracker-backend` folder with:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/jobtracker

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (for real emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 2: Choose Your Email Provider

#### Option A: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account Settings → Security → App Passwords
   - Select "Mail" as the app
   - Generate a 16-character password
   - Use this password in your `EMAIL_PASS` variable (NOT your regular Gmail password)

#### Option B: SendGrid (Recommended for production)

1. **Sign up for SendGrid** (free tier available)
2. **Verify your sender email** in SendGrid dashboard
3. **Get your API key** from SendGrid
4. **Update your .env file:**
   ```env
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_USER=your-verified-sender@yourdomain.com
   ```

#### Option C: Other SMTP Providers

For providers like Outlook, Yahoo, or custom SMTP:

```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@your-provider.com
EMAIL_PASS=your-password
```

### Step 3: Test the Setup

1. **Start your backend server:**
   ```bash
   cd job-tracker-backend
   npm start
   ```

2. **Test the forgot password flow:**
   - Go to your frontend forgot password page
   - Enter a real email address
   - Check if you receive the email

3. **Check server logs:**
   - If using Gmail: You should see "Production email sent successfully"
   - If using test setup: You'll see preview URLs in the console

### Step 4: Troubleshooting

#### Gmail Issues:
- **"Invalid credentials"**: Make sure you're using an App Password, not your regular password
- **"Less secure app access"**: Enable 2FA and use App Passwords instead
- **"Access blocked"**: Check if your Gmail account has any security restrictions

#### SendGrid Issues:
- **"Unauthorized"**: Check your API key
- **"Sender not verified"**: Verify your sender email in SendGrid dashboard

#### General Issues:
- **"Failed to fetch"**: Make sure your backend server is running
- **"Email not sending"**: Check your environment variables and restart the server

### Current Status

✅ **Email service already implemented**
✅ **Test email system working**
✅ **Production email system ready**
✅ **Beautiful email templates included**
✅ **Multiple email provider support**

### Next Steps

1. Choose your preferred email provider
2. Set up the environment variables
3. Test the password reset flow
4. Deploy with real email credentials

Your system will automatically switch between test emails (for development) and real emails (for production) based on your environment variables! 