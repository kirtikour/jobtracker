require('dotenv').config();
const { sendPasswordResetEmail } = require('./utils/emailService');

async function testEmail() {
  try {
    console.log('🧪 Testing email functionality...');
    console.log('📧 Environment:', process.env.NODE_ENV || 'development');
    console.log('📧 Email User:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
    console.log('📧 SendGrid API Key:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set');
    
    // Test email
    const testEmail = 'test@example.com';
    const testResetLink = 'http://localhost:5173/reset-password?token=test-token-123';
    
    console.log('\n📤 Sending test email to:', testEmail);
    const result = await sendPasswordResetEmail(testEmail, testResetLink);
    
    console.log('\n✅ Email test completed successfully!');
    console.log('📧 Result:', result);
    
  } catch (error) {
    console.error('\n❌ Email test failed:', error.message);
    console.error('💡 Make sure your environment variables are set correctly.');
  }
}

// Run the test
testEmail(); 