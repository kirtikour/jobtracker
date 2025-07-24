
import React, { useState } from 'react';
import JobDashboard from './JobDashboard';
import AddJobForm from './AddJobForm';
import AuthPage from './AuthPage';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Button, ConfigProvider, theme as antdTheme } from 'antd';
import './App.css';
import Navbar from './Navbar';
import Landing from './Landingpage';
import Job from './Job';
import Dashboard from './Dashboard';
import { AuthProvider } from './AuthContext';

function App() {
  const [jobs, setJobs] = useState([]);

  const handleAddJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  return (
    <AuthProvider>
      <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
        <Router>
          <div style={{ minHeight: '100vh', width: '100vw', background: '#f6f7fb' }}>
            <Routes>
              <Route path="/" element={<Landing/>} />
              <Route path="/jobs" element={<Job />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;

