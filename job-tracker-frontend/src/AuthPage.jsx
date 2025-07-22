import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Checkbox, Divider } from 'antd';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const { Title } = Typography;

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google OAuth client ID

const jobImage = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'; // Example job-related image

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);

  // Handle Google login/signup
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Send credentialResponse.credential to your backend for verification
      message.success('Google sign-in successful! (Backend logic needed)');
    } catch (err) {
      message.error('Google sign-in failed');
    }
    setLoading(false);
  };

  // Handle form submit
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isSignup) {
        // Signup logic
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (res.ok) {
          message.success('Signup successful!');
        } else {
          message.error(data.msg || 'Signup failed');
        }
      } else {
        // Login logic
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (res.ok) {
          message.success('Login successful!');
        } else {
          message.error(data.msg || 'Login failed');
        }
      }
    } catch (err) {
      message.error('Something went wrong');
    }
    setLoading(false);
  };

  // Handle toggle with fade/slide effect
  const handleToggle = () => {
    setFade(true);
    setTimeout(() => {
      setIsSignup((prev) => !prev);
      setFade(false);
    }, 300);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: '#f6f7fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          className="auth-book-container"
          style={{
            width: '900px',
            maxWidth: '100vw',
            minHeight: 520,
            maxHeight: 700,
            margin: '48px 0',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            background: '#fff',
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
            flexDirection: 'row',
            boxSizing: 'border-box',
            height: '70vh',
            minHeight: 0,
          }}
        >
          {/* Left: Image and caption (always visible) */}
          <div
            className="auth-book-image"
            style={{
              flex: '0 0 50%',
              minWidth: 0,
              height: '100%',
              background: `url(${jobImage}) center/cover no-repeat`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: 36,
              color: '#fff',
              position: 'relative',
              boxSizing: 'border-box',
              minHeight: 0,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: 2, marginBottom: 16, textShadow: '0 2px 8px #000' }}>JobFinder</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 12, textShadow: '0 2px 8px #000' }}>
              Find your dream job, track your applications, and get hired!
            </div>
            <div style={{ opacity: 0.8, fontSize: 15, textShadow: '0 1px 4px #000' }}>Empowering your career journey.</div>
          </div>

          {/* Right: Single form panel with fade/slide transition */}
          <div
            className="auth-book-form-panel"
            style={{
              flex: '0 0 50%',
              minWidth: 0,
              height: '100%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflowY: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box',
              borderLeft: '1.5px solid #ececec',
              boxShadow: '-8px 0 24px -12px #ececec',
              minHeight: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 340,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 32px',
                boxSizing: 'border-box',
                minHeight: 0,
                minHeight: 400,
                opacity: fade ? 0 : 1,
                transform: fade ? (isSignup ? 'translateX(40px)' : 'translateX(-40px)') : 'translateX(0)',
                transition: 'opacity 0.3s, transform 0.3s',
              }}
            >
              {isSignup ? (
                <>
                  <Title level={2} style={{ color: '#222', marginBottom: 8, fontWeight: 700, fontSize: 32, textAlign: 'left' }}>
                    Create an account
                  </Title>
                  <div style={{ color: '#888', marginBottom: 24, textAlign: 'left' }}>
                    Already have an account?{' '}
                    <Button type="link" style={{ padding: 0, color: '#7c5cff' }} onClick={handleToggle}>
                      Log in
                    </Button>
                  </div>
                  <Form layout="vertical" style={{ width: '100%' }} onFinish={onFinish}>
                    <Form.Item name="name" label={<span style={{ color: '#222' }}>Name</span>} rules={[{ required: true, message: 'Please enter your name' }]}> 
                      <Input placeholder="Your Name" style={{ background: '#f6f7fb', color: '#222', border: '1px solid #ddd' }} />
                    </Form.Item>
                    <Form.Item name="email" label={<span style={{ color: '#222' }}>Email</span>} rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
                      <Input placeholder="you@example.com" style={{ background: '#f6f7fb', color: '#222', border: '1px solid #ddd' }} />
                    </Form.Item>
                    <Form.Item name="password" label={<span style={{ color: '#222' }}>Password</span>} rules={[{ required: true, message: 'Please enter your password' }]}> 
                      <Input.Password placeholder="Password" style={{ background: '#f6f7fb', color: '#222', border: '1px solid #ddd' }} />
                    </Form.Item>
                    <Form.Item name="terms" valuePropName="checked" rules={[{ required: true, message: 'You must agree to the terms' }]} style={{ marginBottom: 8 }}>
                      <Checkbox style={{ color: '#222' }}>
                        I agree to the <a href="#" style={{ color: '#7c5cff' }}>Terms & Conditions</a>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#7c5cff', border: 'none', fontWeight: 600, fontSize: 16, height: 44 }}>
                        Create account
                      </Button>
                    </Form.Item>
                  </Form>
                  <Divider style={{ color: '#888', borderColor: '#eee', margin: '24px 0 16px 0' }}>Or register with</Divider>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => message.error('Google sign-in failed')} width="100%" />
                  </div>
                </>
              ) : (
                <>
                  <Title level={2} style={{ color: '#222', marginBottom: 8, fontWeight: 700, fontSize: 32, textAlign: 'left' }}>
                    Sign in to your account
                  </Title>
                  <div style={{ color: '#888', marginBottom: 24, textAlign: 'left' }}>
                    Don’t have an account?{' '}
                    <Button type="link" style={{ padding: 0, color: '#7c5cff' }} onClick={handleToggle}>
                      Sign up
                    </Button>
                  </div>
                  <Form layout="vertical" style={{ width: '100%' }} onFinish={onFinish}>
                    <Form.Item name="email" label={<span style={{ color: '#222' }}>Email</span>} rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
                      <Input placeholder="you@example.com" style={{ background: '#f6f7fb', color: '#222', border: '1px solid #ddd' }} />
                    </Form.Item>
                    <Form.Item name="password" label={<span style={{ color: '#222' }}>Password</span>} rules={[{ required: true, message: 'Please enter your password' }]}> 
                      <Input.Password placeholder="Password" style={{ background: '#f6f7fb', color: '#222', border: '1px solid #ddd' }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#7c5cff', border: 'none', fontWeight: 600, fontSize: 16, height: 44 }}>
                        Sign in
                      </Button>
                    </Form.Item>
                  </Form>
                  <Divider style={{ color: '#888', borderColor: '#eee', margin: '24px 0 16px 0' }}>Or sign in with</Divider>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => message.error('Google sign-in failed')} width="100%" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .auth-book-container {
              flex-direction: column !important;
              width: 98vw !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              margin: 24px 0 !important;
            }
            .auth-book-image {
              flex: none !important;
              width: 100% !important;
              min-height: 180px !important;
              height: 220px !important;
              border-radius: 20px 20px 0 0 !important;
              padding: 24px !important;
            }
            .auth-book-form-panel {
              flex: none !important;
              width: 100% !important;
              min-height: 0 !important;
              height: auto !important;
              padding: 0 !important;
              border-left: none !important;
              box-shadow: none !important;
              overflow-y: auto !important;
            }
          }
        `}</style>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage; 