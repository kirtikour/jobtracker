import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple notification system
const showNotification = (message, type = 'info') => {
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
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification('✅ Password reset link sent to your email!', 'success');
        setEmailSent(true);
      } else {
        showNotification(data.msg || 'Failed to send reset link', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.title}>Check your email</h1>
          <p style={styles.subtitle}>
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <div style={styles.actions}>
            <button 
              style={styles.secondaryButton}
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              Send another link
            </button>
            <button 
              style={styles.primaryButton}
              onClick={() => navigate('/auth')}
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Forgot your password?</h1>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <button 
          style={styles.backButton}
          onClick={() => navigate('/auth')}
        >
          ← Back to sign in
        </button>
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
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    border: '1px solid #04454f',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#c1ff72',
  },
  subtitle: {
    fontSize: '15px',
    color: '#d7f5e7',
    marginBottom: '32px',
    lineHeight: '1.6',
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
    marginBottom: '8px',
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
  },
  secondaryButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#c1ff72',
    border: '1px solid #c1ff72',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  primaryButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#c1ff72',
    color: '#033f47',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#8ab7b0',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  successIcon: {
    fontSize: '56px',
    color: '#c1ff72',
    marginBottom: '20px',
  },
  actions: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};

export default ForgotPassword; 