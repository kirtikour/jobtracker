import React, { useState } from 'react';
import JobDashboard from './JobDashboard';
import AddJobForm from './AddJobForm';
import AuthPage from './AuthPage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import PostJobForm from './PostJobForm';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Button, ConfigProvider, theme as antdTheme } from 'antd';
import './App.css';
import Navbar from './Navbar';
import Landing from './Landingpage';
import Job from './Job';
import Dashboard from './Dashboard';
import JobDetail from './JobDetail';
import Profile from './Profile';
import { AuthProvider } from './AuthContext';
import Companies from './Companies';
import Preparation from './Preparation';
import JobRecommendations from './JobRecommendations';
import About from './About';
import Contact from './Contact';
import { ThemeProvider, useTheme } from './ThemeContext';
import AppGrid from './AppGrid';

const GlobalLayout = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: theme.colors.primaryBg,
      color: theme.colors.textPrimary,
      position: 'relative',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <AppGrid />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [jobs, setJobs] = useState([]);

  const handleAddJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
          <Router>
            <GlobalLayout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/jobs" element={<Job />} />
                <Route path="/post-job" element={<PostJobForm />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/Preparation" element={<Preparation />} />
                <Route path="/recommendations" element={<JobRecommendations />} />
                <Route path="/job/:jobId" element={<JobDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </GlobalLayout>
          </Router>
        </ConfigProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

