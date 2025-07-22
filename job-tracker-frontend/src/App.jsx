import React, { useState } from 'react';
import JobDashboard from './JobDashboard';
import AddJobForm from './AddJobForm';
import AuthPage from './AuthPage';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Button, ConfigProvider, theme as antdTheme } from 'antd';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);

  const handleAddJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  return (
    <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
      <Router>
        <div style={{ minHeight: '100vh', width: '100vw', background: '#f6f7fb' }}>
          <Routes>
            <Route path="/" element={<Home jobs={jobs} onAddJob={handleAddJob} />} />
            <Route path="/job/:id" element={<JobDetails jobs={jobs} setJobs={setJobs} />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

function Home({ jobs, onAddJob }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');

  const handleJobClick = (job) => {
    const idx = jobs.indexOf(job);
    if (idx !== -1) navigate(`/job/${idx}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 16 }}>
        <Button type={tab === 'dashboard' ? 'primary' : 'default'} onClick={() => setTab('dashboard')}>Dashboard</Button>
        <Button type={tab === 'add' ? 'primary' : 'default'} onClick={() => setTab('add')}>Add Job</Button>
      </div>
      {tab === 'dashboard' && <JobDashboard jobs={jobs} onJobClick={handleJobClick} />}
      {tab === 'add' && <AddJobForm onAddJob={(job) => { onAddJob(job); setTab('dashboard'); }} />}
    </div>
  );
}

function JobDetails({ jobs, setJobs }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs[parseInt(id, 10)];

  if (!job) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Job not found.</div>;

  // Skeleton for now
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2>{job.company} - {job.title}</h2>
      <p><b>Status:</b> {job.status}</p>
      <p><b>Applied Date:</b> {job.date}</p>
      <p><b>Notes:</b> {job.notes}</p>
      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={() => navigate(-1)} style={{ marginRight: 8 }}>Back</Button>
        {/* Edit and Delete buttons will be added here */}
      </div>
    </div>
  );
}

export default App;
