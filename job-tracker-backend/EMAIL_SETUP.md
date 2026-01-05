# Email Setup for Password Reset

## Current Development Setup
The current implementation logs OTP codes to the console for development purposes. You can see the OTP in your server console when testing the forgot password functionality.

## Production Email Setup

### Option 1: Using Nodemailer with Gmail

1. Install nodemailer:
```bash
npm install nodemailer
```

2. Set up environment variables in your `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

3. For Gmail, you'll need to:
   - Enable 2-factor authentication
   - Generate an "App Password" (not your regular password)
   - Use the app password in EMAIL_PASS

### Option 2: Using Nodemailer with Other Providers

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

### Option 3: Using Email Services

#### SendGrid
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: 'your-verified-sender@yourdomain.com',
    subject: 'Password Reset OTP - Job Tracker',
    html: `Your OTP is: ${otp}`,
  };
  
  await sgMail.send(msg);
};
```

#### AWS SES
```bash
npm install aws-sdk
```

```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sendOTPEmail = async (email, otp) => {
  const params = {
    Source: 'your-verified-email@yourdomain.com',
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'Password Reset OTP - Job Tracker' },
      Body: { Html: { Data: `Your OTP is: ${otp}` } },
    },
  };
  
  await ses.sendEmail(params).promise();
};
```

## Testing
1. Start your backend server
2. Go to the forgot password page
3. Enter an email address
4. Check your server console for the OTP code
5. Use that OTP to complete the password reset process

## Security Notes
- OTPs expire after 10 minutes
- OTPs can only be used once
- Failed attempts are logged
- Consider rate limiting for production use 