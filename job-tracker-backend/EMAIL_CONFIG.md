# Email Configuration Guide

## Current Setup (Development)
The current setup uses Ethereal Email (fake SMTP) for development. This means:
- Emails are not actually sent to real addresses
- You get preview URLs in the console to view the emails
- Perfect for testing without needing real email credentials

## To Send Real Emails

### Option 1: Gmail Setup

1. **Create a `.env` file** in the `job-tracker-backend` folder with:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

2. **For Gmail, you need to:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an "App Password" (not your regular password)
   - Go to Google Account Settings → Security → App Passwords
   - Generate a new app password for "Mail"
   - Use that 16-character password in EMAIL_PASS

### Option 2: Other Email Providers

Update the `createProductionTransporter` function in `utils/emailService.js`:

```javascript
const createProductionTransporter = () => {
  return nodemailer.createTransporter({
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};
```

### Option 3: Email Services

#### SendGrid (Recommended for production)
```bash
npm install @sendgrid/mail
```

Then update `utils/emailService.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = async (email, resetLink) => {
  const msg = {
    to: email,
    from: 'your-verified-sender@yourdomain.com',
    subject: 'Reset Your Password - Job Tracker',
    html: `Your reset link: ${resetLink}`,
  };
  
  await sgMail.send(msg);
};
```

## Testing the Current Setup

1. **Start the backend server:**
```bash
cd job-tracker-backend
npm start
```

2. **Test the forgot password flow:**
   - Go to `/forgot-password`
   - Enter any email address
   - Check your server console for the email preview URL
   - Click the preview URL to see the email

3. **The console will show:**
```
📧 Password reset email sent successfully!
🔗 Preview URL: https://ethereal.email/message/...
🔗 Reset Link: http://localhost:5173/reset-password?token=...
📧 Message ID: <message-id>
```

## For Production

When you're ready to deploy:
1. Set up a real email service (SendGrid, AWS SES, or Gmail)
2. Update the environment variables
3. Set `NODE_ENV=production`
4. Update `FRONTEND_URL` to your actual domain

## Troubleshooting

### "Failed to fetch" Error
This means your backend server isn't running. Start it with:
```bash
cd job-tracker-backend
npm start
```

### Email Not Sending
- Check your environment variables
- Verify your email credentials
- Check if your email provider allows SMTP access
- For Gmail, make sure you're using an App Password, not your regular password 