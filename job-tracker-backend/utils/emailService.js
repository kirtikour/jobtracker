const nodemailer = require('nodemailer');

// Check if SendGrid is available
let sgMail = null;
try {
  sgMail = require('@sendgrid/mail');
} catch (error) {
  // SendGrid not installed, will use nodemailer
}

// Create a test account for development (you can replace with real SMTP credentials)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
};

// For production, use real SMTP credentials
const createProductionTransporter = () => {
  // Check if SendGrid is configured
  if (sgMail && process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return 'sendgrid';
  }
  
  // Check if Gmail credentials are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Check for custom SMTP configuration
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Fallback to test account if no credentials
  console.log('⚠️ No email credentials found. Using test account.');
  return createTestAccount();
};

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    // Use production credentials if available, otherwise use test account
    const transporter = process.env.NODE_ENV === 'production' && (process.env.EMAIL_USER || process.env.SENDGRID_API_KEY)
      ? createProductionTransporter()
      : await createTestAccount();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Job Tracker</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Reset Your Password</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          
          <p style="color: #667eea; font-size: 12px; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
            ${resetLink}
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated message from Job Tracker. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    let info;
    
    // Handle SendGrid
    if (transporter === 'sendgrid') {
      const msg = {
        to: email,
        from: process.env.EMAIL_USER || 'noreply@jobtracker.com',
        subject: 'Reset Your Password - Job Tracker',
        html: emailHtml,
      };
      
      info = await sgMail.send(msg);
      info.messageId = info[0]?.headers['x-message-id'] || 'sendgrid-message-id';
    } else {
      // Handle Nodemailer (Gmail, custom SMTP, or test)
      const mailOptions = {
        from: process.env.NODE_ENV === 'production' && process.env.EMAIL_USER
          ? process.env.EMAIL_USER 
          : '"Job Tracker" <noreply@jobtracker.com>',
        to: email,
        subject: 'Reset Your Password - Job Tracker',
        html: emailHtml,
      };

      info = await transporter.sendMail(mailOptions);
    }
    
    if (process.env.NODE_ENV !== 'production' || (!process.env.EMAIL_USER && !process.env.SENDGRID_API_KEY)) {
      console.log('📧 Test email sent successfully!');
      if (info.messageId && !transporter === 'sendgrid') {
        console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      console.log('🔗 Reset Link:', resetLink);
      console.log('📧 Message ID:', info.messageId);
    } else {
      console.log('📧 Production email sent successfully to:', email);
      console.log('📧 Message ID:', info.messageId);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendPasswordResetEmail }; 