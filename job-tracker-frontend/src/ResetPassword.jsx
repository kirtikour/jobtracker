import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/verify-reset-token/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setTokenValid(true);
        setEmail(data.email);
      } else {
        setTokenValid(false);
      }
    } catch (err) {
      console.error('Token verification error:', err);
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification('✅ Password reset successfully!', 'success');
        setSuccess(true);
      } else {
        showNotification(data.msg || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showNotification('Network error. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingIcon}>⏳</div>
          <h1 style={styles.title}>Verifying Reset Link...</h1>
          <p style={styles.subtitle}>
            Please wait while we verify your password reset link.
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorIcon}>⚠️</div>
          <h1 style={styles.title}>Invalid Reset Link</h1>
          
          <div style={styles.errorBox}>
            <div style={styles.errorContent}>
              <span style={styles.errorX}>✕</span>
              <div>
                <div style={styles.errorTitle}>Reset Link Expired or Invalid</div>
                <div style={styles.errorMessage}>
                  This password reset link has expired or is invalid. Please request a new password reset link.
                </div>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button 
              style={styles.primaryButton}
              onClick={() => navigate('/forgot-password')}
            >
              Request New Reset Link
            </button>
            <button 
              style={styles.secondaryButton}
              onClick={() => navigate('/auth')}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.title}>Password Reset Successfully!</h1>
          <p style={styles.subtitle}>
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button 
            style={styles.primaryButton}
            onClick={() => navigate('/auth')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Your Password</h1>
        <p style={styles.subtitle}>
          Create a new password for your account
        </p>

        <div style={styles.emailBox}>
          <div style={styles.emailContent}>
            <span style={styles.emailIcon}>✓</span>
            <div>
              <div style={styles.emailTitle}>Reset Link Verified</div>
              <div style={styles.emailMessage}>
                You're resetting the password for: <strong>{email}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleResetPassword} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <button 
          style={styles.backButton}
          onClick={() => navigate('/auth')}
        >
          ← Back to Sign In
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
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '320px',
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
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#c1ff72',
    border: '1px solid #c1ff72',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    marginRight: '12px',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#c1ff72',
    color: '#033f47',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
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
    fontSize: '48px',
    color: '#c1ff72',
    marginBottom: '16px',
  },
  loadingIcon: {
    fontSize: '48px',
    color: '#c1ff72',
    marginBottom: '16px',
  },
  errorIcon: {
    fontSize: '48px',
    color: '#ff6b6b',
    marginBottom: '16px',
  },
  actions: {
    marginTop: '24px',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  errorContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  errorX: {
    color: '#ff6b6b',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '2px',
  },
  errorTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#c1ff72',
    marginBottom: '4px',
  },
  errorMessage: {
    fontSize: '14px',
    color: '#d7f5e7',
    lineHeight: '1.4',
  },
  emailBox: {
    backgroundColor: 'rgba(193, 255, 114, 0.1)',
    border: '1px solid rgba(193, 255, 114, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  emailContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  emailIcon: {
    color: '#c1ff72',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '2px',
  },
  emailTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#c1ff72',
    marginBottom: '4px',
  },
  emailMessage: {
    fontSize: '14px',
    color: '#d7f5e7',
    lineHeight: '1.4',
  },
};

export default ResetPassword; 