// src/Landingpage.jsx

import React, { useEffect, useState } from 'react';
import { Input, Button, Spin, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Make sure you import Link
import Navbar from './Navbar';
import JobCard from './JobCard';
import landinggirl from './assets/landinggirl.jpg';

const Landing = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://remoteok.com/api');
        const data = await response.json();

        const jobList = data.slice(1).filter(job => job.position && job.company);
        setJobs(jobList);
        
        // Extract unique companies from jobs
        const uniqueCompanies = Array.from(new Set(jobList.map(job => job.company)))
          .map(companyName => {
            const job = jobList.find(job => job.company === companyName);
            return {
              name: companyName,
              logo: job.company_logo || null,
              url: job.company_url || '#'
            };
          })
          .filter(company => company.name)
          .slice(0, 12); // Limit to 12 companies
        
        setCompanies(uniqueCompanies);
        setLoadingCompanies(false);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setLoadingCompanies(false);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={{ 
      background: '#033f47', 
      minHeight: '100vh', /* Change from 100% to 100vh */
      color: 'white', 
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />

      {/* HERO SECTION - Always visible */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '80px 100px', 
        flexWrap: 'wrap',
        flex: '0 0 auto' /* Ensure this section doesn't shrink */
      }}>
        <div style={{ maxWidth: '50%' }}>
          <h4 style={{ color: '#c1ff72' }}>Number #1 Job Searching Site</h4>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: 1.3 }}>
            Over <span style={{ color: '#c1ff72' }}>4500+</span> Jobs <br />
            Waiting For You
          </h1>
          <p style={{ fontSize: '16px', margin: '20px 0', color: '#d7f5e7' }}>
            The job market is constantly evolving, presenting both challenges and opportunities.
          </p>

          <div style={{
            display: 'flex',
            background: 'white',
            borderRadius: 10,
            padding: '4px 8px',
            width: '400px',
            marginTop: 24
          }}>
            <Input
              placeholder="Search by keywords or role"
              style={{ border: 'none', flex: 1 }}
              prefix={<SearchOutlined />}
            />
            <Button style={{ borderRadius: 8, backgroundColor: '#c1ff72', color: '#033f47', border: 'none' }}>
              Search
            </Button>
          </div>

          <p style={{ fontSize: 14, marginTop: 20 }}>
            Popular Categories: <span style={{ color: '#c1ff72' }}>Product Designer, Developer, Designer</span>
          </p>
        </div>

        <div style={{ position: 'relative', marginTop: 40 }}>
          <img
            src={landinggirl}
            alt="Landing"
            style={{
              width: 400,
              height: 400,
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(0,0,0,0.3)'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 20,
            right: -30,
            background: 'white',
            color: '#033f47',
            borderRadius: 12,
            padding: '8px 16px',
            fontWeight: 600,
            boxShadow: '0 0 12px rgba(0,0,0,0.2)'
          }}>
            234+ Daily Job Posts
          </div>
        </div>
      </div>

      {/* POPULAR COMPANIES SECTION */}
      <div style={{ 
        padding: '40px 100px',
        backgroundColor: '#022e38',
      }}>
        <h2 style={{ color: '#c1ff72', marginBottom: 30 }}>Popular Companies</h2>
        
        {loadingCompanies ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#c1ff72' }}>Loading companies...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 20,
            justifyContent: 'center'
          }}>
            {companies.map((company, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#033f47',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  padding: 10,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                  e.currentTarget.style.backgroundColor = '#044956';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.backgroundColor = '#033f47';
                }}
                onClick={() => window.open(company.url, '_blank')}
              >
                {company.logo ? (
                  <Avatar 
                    src={company.logo} 
                    size={60} 
                    style={{ marginBottom: 8 }}
                  />
                ) : (
                  <Avatar 
                    size={60} 
                    style={{ 
                      backgroundColor: '#c1ff72', 
                      color: '#033f47',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 'bold'
                    }}
                  >
                    {company.name.charAt(0)}
                  </Avatar>
                )}
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 'bold',
                  color: '#c1ff72',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {company.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOB CARDS SECTION */}
      <div style={{ 
        padding: '40px 100px',
        flex: '1 0 auto' /* Allow this section to grow but not shrink */
      }}>
        <h2 style={{ color: '#c1ff72', marginBottom: 30 }}>Latest Jobs</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#c1ff72' }}>Loading jobs...</p>
          </div>
        ) : (
          <>
            {jobs.length > 0 ? (
              jobs.slice(0, visibleCount).map((job, index) => (
                <JobCard
                  key={job.id || index}
                  title={job.position}
                  company={job.company}
                  tags={[job.location || 'Remote', job.type || 'Full-Time']}
                  url={job.url || '#'}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p>No jobs found. Please try again later.</p>
              </div>
            )}
          </>
        )}

        {jobs.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/jobs">
              <Button
                style={{
                  backgroundColor: '#c1ff72',
                  color: '#033f47',
                  border: 'none',
                  borderRadius: 8
                }}
              >
                See More Jobs
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
