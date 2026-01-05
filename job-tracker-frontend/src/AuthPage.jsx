import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Simple notification system
const showNotification = (message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#4caf50';
      break;
    case 'error':
      notification.style.backgroundColor = '#f44336';
      break;
    case 'warning':
      notification.style.backgroundColor = '#ff9800';
      break;
    default:
      notification.style.backgroundColor = '#2196f3';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
};

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect to dashboard when logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (isSignup) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignup) {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await res.json();

        if (res.ok) {
          showNotification('✅ Account created successfully!', 'success');
          // Auto-login after successful signup
          const loginResult = await login(formData.email, formData.password);
          if (loginResult.success) {
            showNotification('🎉 Welcome! You are now logged in.', 'success');
            navigate('/dashboard');
          } else {
            showNotification('Account created but auto-login failed. Please sign in manually.', 'warning');
            setIsSignup(false);
          }
        } else {
          showNotification(data.msg || 'Signup failed. Please check your information.', 'error');
        }
              } else {
          const result = await login(formData.email, formData.password);
          if (result.success) {
            showNotification('🎉 Welcome back! You are now logged in.', 'success');
            navigate('/dashboard');
          } else {
            showNotification(result.error || 'Invalid email or password.', 'error');
          }
        }
    } catch (err) {
      showNotification('Network error. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isSignup ? 'Create Account' : 'Sign In'}
        </h1>
        <p style={styles.subtitle}>
          {isSignup 
            ? 'Join us and start tracking your job applications' 
            : 'Welcome back! Sign in to your account'
          }
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={styles.input}
                required={isSignup}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                style={styles.input}
                required={isSignup}
              />
            </div>
          )}

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading 
              ? (isSignup ? 'Creating Account...' : 'Signing In...') 
              : (isSignup ? 'Create Account' : 'Sign In')
            }
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        <button 
          style={styles.toggleButton}
          onClick={toggleMode}
        >
          {isSignup 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"
          }
        </button>

        {!isSignup && (
          <button 
            style={styles.forgotButton}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#033f47',
    padding: '20px',
  },
  card: {
    backgroundColor: '#022e38',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    border: '1px solid #04454f',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#c1ff72',
  },
  subtitle: {
    fontSize: '14px',
    color: '#d7f5e7',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#c1ff72',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #04454f',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    backgroundColor: '#033f47',
    color: '#d7f5e7',
    transition: 'border-color 0.3s ease',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '14px',
    marginBottom: '16px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 107, 107, 0.3)',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#c1ff72',
    color: '#033f47',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0',
    gap: '16px',
  },
  dividerLine: {
    flex: 1,
    height: '2px',
    backgroundColor: '#04454f',
  },
  dividerText: {
    color: '#8ab7b0',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#c1ff72',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginBottom: '16px',
    fontWeight: '500',
  },
  forgotButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#8ab7b0',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default AuthPage;

