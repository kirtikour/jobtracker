import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Checkbox, Divider } from 'antd';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const { Title } = Typography;

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google OAuth client ID
const jobImage =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Here you would typically decode the JWT and create a user session
      message.success('Google sign-in successful!');
      // For now, we'll use mock login
      const result = await login('google@example.com', 'password');
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      message.error('Google sign-in failed');
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isSignup) {
        // Handle signup
        const url = 'http://localhost:5000/api/auth/register';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          message.success('Signup successful! Please login.');
          setIsSignup(false);
        } else {
          message.error(data.msg + 'Signup failed');
        }
      } else {
        // Handle login
        const result = await login(values.email, values.password);
        if (result.success) {
          message.success('Login successful!');
          navigate('/dashboard');
        } else {
          message.error(result.error + 'Login failed');
        }
      }
    } catch (err) {
      message.error('Something went wrong');
      console.error('Auth error:', err);
    }
    setLoading(false);
  };

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
          padding: '20px',
        }}
      >
        <div
          className="auth-book-container"
          style={{
            width: isSignup ? '600px' : '900px',
            maxWidth: '100vw',
            height: 'auto',
            minHeight: 520,
            maxHeight: 650,
            margin: '40px 0',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            background: '#fff',
            display: 'flex',
            flexDirection: isSignup ? 'column' : 'row',
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {!isSignup && (
            <div
              className="auth-book-image"
              style={{
                flex: '0 0 50%',
                background: `url(${jobImage}) center/cover no-repeat`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: 36,
                color: '#fff',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 28,
                  letterSpacing: 2,
                  marginBottom: 16,
                  textShadow: '0 2px 8px #000',
                }}
              >
                Finder
              </div>
              <div style={{ flex: 1 }} />
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  marginBottom: 12,
                  textShadow: '0 2px 8px #000',
                }}
              >
                Find your dream job, track your applications, and get hired!
              </div>
              <div
                style={{
                  opacity: 0.8,
                  fontSize: 15,
                  textShadow: '0 1px 4px #000',
                }}
              >
                Empowering your career journey.
              </div>
            </div>
          )}

          {/* Form Section */}
          <div
            className="auth-book-form-panel"
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: '30px 20px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 400,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: fade ? 0 : 1,
                transform: fade ? (isSignup ? 'translateX(40px)' : 'translateX(-40px)') : 'translateX(0)',
                transition: 'opacity 0.3s, transform 0.3s',
              }}
            >
              {isSignup ? (
                <>
                  <Title level={2} style={{ color: '#222', marginBottom: 8, fontWeight: 700, fontSize: 32 }}>
                    Create an account
                  </Title>
                  <div style={{ color: '#888', marginBottom: 16 }}>
                    Already have an account?{' '}
                    <Button
                      type="link"
                      style={{
                        padding: 0,
                        color: '#7c5cff',
                        boxShadow: 'none',
                        border: 'none',
                        background: 'none',
                        textDecoration: 'none',
                      }}
                      onClick={handleToggle}
                    >
                      Sign in
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Title level={2} style={{ color: '#222', marginBottom: 8, fontWeight: 700, fontSize: 32 }}>
                    Welcome back
                  </Title>
                  <div style={{ color: '#888', marginBottom: 16 }}>
                    Don't have an account?{' '}
                    <Button
                      type="link"
                      style={{
                        padding: 0,
                        color: '#7c5cff',
                        boxShadow: 'none',
                        border: 'none',
                        background: 'none',
                        textDecoration: 'none',
                      }}
                      onClick={handleToggle}
                    >
                      Sign up
                    </Button>
                  </div>
                </>
              )}

              <Form
                name={isSignup ? 'signup' : 'login'}
                onFinish={onFinish}
                layout="vertical"
                style={{ width: '100%' }}
                size="large"
              >
                {isSignup && (
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                )}

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                {isSignup && (
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm your password" />
                  </Form.Item>
                )}

                {!isSignup && (
                  <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                      <Button type="link" style={{ padding: 0, color: '#7c5cff' }}>
                        Forgot password?
                      </Button>
                    </div>
                  </Form.Item>
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      width: '100%',
                      height: 48,
                      backgroundColor: '#7c5cff',
                      borderColor: '#7c5cff',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {isSignup ? 'Create Account' : 'Sign In'}
                  </Button>
                </Form.Item>

                <Divider style={{ margin: '20px 0', color: '#888' }}>or</Divider>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => message.error('Google sign-in failed')}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;
