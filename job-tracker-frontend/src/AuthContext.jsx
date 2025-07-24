import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock user data - replace with actual API calls
  const mockUser = {
    id: 1,
    name: 'Kirti Kour',
    email: 'kirtikour.bscsf22@iba-suk.edu.pk',
    phone: '+92 123 456 7890',
    address: 'Sukkur, Pakistan',
    avatar: null,
    skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'UI/UX Design'],
    applications: [
      {
        id: 1,
        company: 'Haier',
        position: 'INTERNSHIP',
        status: 'Pending Test',
        date: 'Jul 16, 2025',
        logo: null
      },
      {
        id: 2,
        company: 'Google',
        position: 'Frontend Developer',
        status: 'Interview',
        date: 'Jul 10, 2025',
        logo: null
      },
      {
        id: 3,
        company: 'Microsoft',
        position: 'Software Engineer',
        status: 'Applied',
        date: 'Jul 5, 2025',
        logo: null
      }
    ]
  };

  useEffect(() => {
    // Check if user is logged in (check localStorage, token, etc.)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - replace with actual API call
      if (email && password) {
        localStorage.setItem('authToken', 'mock-token');
        localStorage.setItem('userData', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};