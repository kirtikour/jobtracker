require('dotenv').config();
const { sendPasswordResetEmail } = require('./utils/emailService');

async function testGmail() {
  try {
    console.log('🧪 Testing Gmail email functionality...');
    console.log('📧 Environment:', process.env.NODE_ENV || 'development');
    console.log('📧 Email User:', process.env.EMAIL_USER || '❌ Not set');
    console.log('📧 Email Pass:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('\n❌ Gmail credentials not found in .env file!');
      console.error('💡 Make sure you have created the .env file with:');
      console.error('   EMAIL_USER=newstartforyou2003@gmail.com');
      console.error('   EMAIL_PASS=asrm ilvd gjgq veno');
      return;
    }
    
    // Test email to your own Gmail
    const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
    const testResetLink = 'http://localhost:5173/reset-password?token=test-gmail-token-123';
    
    console.log('\n📤 Sending test email to:', testEmail);
    console.log('📧 This will send a real email to your Gmail account...');
    
    const result = await sendPasswordResetEmail(testEmail, testResetLink);
    
    console.log('\n✅ Gmail test completed successfully!');
    console.log('📧 Result:', result);
    console.log('\n📬 Check your Gmail inbox (and spam folder) for the test email!');
    
  } catch (error) {
    console.error('\n❌ Gmail test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.error('\n💡 Gmail Authentication Error:');
      console.error('   - Make sure you\'re using an App Password, not your regular password');
      console.error('   - Enable 2-Factor Authentication on your Gmail account');
      console.error('   - Generate a new App Password: Google Account → Security → App Passwords');
    } else if (error.message.includes('Less secure app access')) {
      console.error('\n💡 Gmail Security Error:');
      console.error('   - Gmail no longer supports "less secure app access"');
      console.error('   - You must use App Passwords with 2FA enabled');
    }
  }
}

// Run the test
testGmail(); 