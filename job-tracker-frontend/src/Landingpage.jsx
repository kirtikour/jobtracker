// src/Landingpage.jsx

import React, { useEffect, useState } from 'react';
import { Input, Button, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import JobCard from './JobCard';
import landinggirl from './assets/landinggirl.jpg';
import { useTheme } from './ThemeContext';

import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Add CSS for floating animation
const floatingStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

// Inject the styles
const styleSheet = document.createElement('style');
styleSheet.textContent = floatingStyles;
document.head.appendChild(styleSheet);

const Landing = () => {
  const navigate = useNavigate();
  const { theme, isDarkMode } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  // ... existing state ...
  const [countries, setCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const countryImages = {
    "Austin": "/src/assets/austin.jpg",
    "California": "/src/assets/california.jpg",
    "New York": "/src/assets/newyork.jpg",
    "Remote": "/src/assets/remotejob.avif",
    "USA": "/src/assets/usa.jpg",
    "Sao Paulo": "/src/assets/Sao-Paulo1-752x630.jpg",
    "Toronto": "/src/assets/tornoto.jpg",
    "London": "/src/assets/London.jpg",
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Fetch jobs and companies from RemoteOK
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://remoteok.com/api');
        const data = await response.json();

        const jobList = data.slice(1).filter(job => job.position && job.company);
        setJobs(jobList);

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
          .slice(0, 8);
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

  // Generate countries from RemoteOK job data
  useEffect(() => {
    const generateCountriesFromJobs = () => {
      try {
        // Create a map of countries and their job counts from the jobs data
        const countryCounts = {};

        jobs.forEach(job => {
          let location = job.location || 'Remote';

          // Normalize location names to match available images
          if (location.toLowerCase().includes('remote')) {
            location = 'Remote';
          } else if (location.toLowerCase().includes('united states') || location.toLowerCase().includes('usa')) {
            location = 'USA';
          } else if (location.toLowerCase().includes('new york')) {
            location = 'New York';
          } else if (location.toLowerCase().includes('california')) {
            location = 'California';
          } else if (location.toLowerCase().includes('austin')) {
            location = 'Austin';
          } else if (location.toLowerCase().includes('sao paulo') || location.toLowerCase().includes('brazil')) {
            location = 'Sao Paulo';
          } else if (location.toLowerCase().includes('toronto') || location.toLowerCase().includes('canada')) {
            location = 'Toronto';
          } else if (location.toLowerCase().includes('london') || location.toLowerCase().includes('united kingdom') || location.toLowerCase().includes('uk')) {
            location = 'London';
          }

          countryCounts[location] = (countryCounts[location] || 0) + 1;
        });

        // Convert to array and filter to only show the specified countries
        const countryList = Object.keys(countryCounts)
          .map(country => ({
            name: country,
            count: countryCounts[country],
            image: countryImages[country] || countryImages["Other"]
          }))
          .filter(country => countryImages[country.name]) // Only include countries with images
          .sort((a, b) => b.count - a.count);

        setCountries(countryList);
        console.log('Generated countries from jobs:', countryList);
      } catch (error) {
        console.error('Failed to generate countries from jobs:', error);
        // Fallback to default countries with available images
        setCountries([
          { name: 'Austin', count: 45, image: countryImages['Austin'] },
          { name: 'California', count: 80, image: countryImages['California'] },
          { name: 'New York', count: 65, image: countryImages['New York'] },
          { name: 'Remote', count: 150, image: countryImages['Remote'] },
          { name: 'USA', count: 120, image: countryImages['USA'] },
          { name: 'Sao Paulo', count: 35, image: countryImages['Sao Paulo'] },
          { name: 'Toronto', count: 40, image: countryImages['Toronto'] },
          { name: 'London', count: 55, image: countryImages['London'] }
        ]);
      }
    };

    // Generate countries when jobs are loaded
    if (jobs.length > 0) {
      generateCountriesFromJobs();
    }
  }, [jobs]);




  return (
    <div style={{
      minHeight: '100vh',
      color: theme.colors.textPrimary,
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'background-color 0.3s'
    }}>
      <Navbar />

      {/* HERO */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '80px 100px', flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1
      }} data-aos="fade-up">

        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${theme.colors.accent} 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, ${theme.colors.accent} 1px, transparent 1px),
            radial-gradient(circle at 40% 40%, ${theme.colors.accent} 1px, transparent 1px),
            radial-gradient(circle at 90% 90%, ${theme.colors.accent} 1px, transparent 1px),
            radial-gradient(circle at 10% 10%, ${theme.colors.accent} 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px, 120px 120px, 200px 200px',
          backgroundPosition: '0 0, 50px 50px, 25px 25px, 75px 75px, 100px 100px'
        }} />

        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.tertiaryBg})`,
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          left: '5%',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.tertiaryBg})`,
          opacity: 0.2,
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.tertiaryBg})`,
          opacity: 0.4,
          animation: 'float 7s ease-in-out infinite'
        }} />

        {/* Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(90deg, ${theme.colors.accent} 1px, transparent 1px),
            linear-gradient(0deg, ${theme.colors.accent} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        <div style={{ maxWidth: '50%' }}>
          <h4 style={{ color: theme.colors.accent }}>Number #1 Job Searching Site</h4>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: 1.3, color: theme.colors.textPrimary }}>
            Over <span style={{ color: theme.colors.accent }}>4500+</span> Jobs <br /> Waiting For You
          </h1>
          <p style={{ fontSize: '16px', margin: '20px 0', color: theme.colors.textSecondary }}>
            The job market is constantly evolving, presenting both challenges and opportunities.
          </p>
          <div style={{
            display: 'flex', background: theme.colors.cardBg, borderRadius: 10, padding: '4px 8px', width: '400px', marginTop: 24, border: `1px solid ${theme.colors.border}`
          }} data-aos="fade-right">
            <Input
              placeholder="Search by keywords or role"
              style={{ border: 'none', flex: 1, backgroundColor: 'transparent', color: theme.colors.textPrimary }}
              prefix={<SearchOutlined style={{ color: theme.colors.textSecondary }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => {
                if (searchTerm.trim()) {
                  navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}
            />
            <Button
              style={{ borderRadius: 8, backgroundColor: theme.colors.accent, color: theme.colors.primaryBg, border: 'none', fontWeight: 'bold' }}
              onClick={() => {
                if (searchTerm.trim()) {
                  navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}
            >
              Search
            </Button>
          </div>
          <p style={{ fontSize: 14, marginTop: 20, color: theme.colors.textSecondary }}>
            Popular Categories: <span style={{ color: theme.colors.accent }}>Product Designer, Developer, Designer</span>
          </p>
        </div>
        <div style={{ position: 'relative', marginTop: 40 }} data-aos="zoom-in">
          <img src={landinggirl} alt="Landing" style={{
            width: 400, height: 400, objectFit: 'cover', borderRadius: '50%', boxShadow: '0 0 30px rgba(0,0,0,0.3)'
          }} />
          <div style={{
            position: 'absolute', bottom: 20, right: -30,
            background: theme.colors.cardBg, color: theme.colors.textPrimary, borderRadius: 12,
            padding: '8px 16px', fontWeight: 600, boxShadow: '0 0 12px rgba(0,0,0,0.2)'
          }}>
            234+ Daily Job Posts
          </div>
        </div>
      </div>

      {/* Popular Companies */}
      <div style={{ padding: '60px 100px', backgroundColor: theme.colors.secondaryBg }} data-aos="fade-up">
        <h2 style={{ color: theme.colors.accent, marginBottom: 40, textAlign: 'center' }}>Popular Companies</h2>
        {loadingCompanies ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin size="large" /><p style={{ marginTop: 16, color: theme.colors.accent }}>Loading companies...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {companies.map((company, i) => (
              <div key={i} style={{ padding: '0 12px' }} data-aos="fade-up">
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'flex-start', height: 180, margin: 'auto',
                  borderRadius: 16, backgroundColor: theme.colors.cardBg,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 20,
                  cursor: 'pointer', textAlign: 'center', transition: 'transform 0.3s ease',
                  border: `1px solid ${theme.colors.border}`
                }}
                  onClick={() => window.open(company.url, '_blank')}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {company.logo ? (
                    <div style={{
                      width: 80, height: 80, borderRadius: '12px', backgroundColor: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 16, overflow: 'hidden'
                    }}>
                      <img src={company.logo} alt={company.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{
                      width: 80, height: 80, borderRadius: '12px', backgroundColor: theme.colors.accent, color: theme.colors.primaryBg,
                      fontWeight: 'bold', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                    }}>{company.name.charAt(0)}</div>
                  )}
                  <div style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest Jobs */}
      <div style={{ padding: '40px 100px', flex: '1 0 auto' }} data-aos="fade-in">
        <h2 style={{ color: theme.colors.accent, marginBottom: 30 }}>Latest Jobs</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" /><p style={{ marginTop: 16, color: theme.colors.accent }}>Loading jobs...</p>
          </div>
        ) : (
          <>
            {jobs.length ? jobs.slice(0, visibleCount).map((job, i) => (
              <JobCard key={i} title={job.position} company={job.company}
                tags={[job.location || 'Remote', job.type || 'Full-Time']} url={job.url || '#'} />
            )) : <div style={{ textAlign: 'center', padding: '20px 0' }}><p>No jobs found. Please try again later.</p></div>}
          </>
        )}
        {jobs.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/jobs"><Button style={{ backgroundColor: theme.colors.accent, color: theme.colors.primaryBg, border: 'none', borderRadius: 8, fontWeight: 'bold' }}>See More Jobs</Button></Link>
          </div>
        )}
      </div>

      {/* Find Jobs by Country (JobDataAPI) */}
      <div style={{ padding: '60px 100px', backgroundColor: theme.colors.secondaryBg }} data-aos="fade-up">
        <h2 style={{ color: theme.colors.accent, marginBottom: 40, textAlign: 'center' }}>Find Jobs by Country</h2>
        {countries.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))',
              gap: 24,
              justifyContent: 'center',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {countries.map((country, i) => (
              <div
                key={i}
                style={{
                  backgroundImage: `url(${country.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 16,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  textShadow: '0 0 10px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                onClick={() => navigate(`/jobs?country=${encodeURIComponent(country.name)}`)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{country.name}</h3>
                <p style={{ fontSize: 16 }}>{country.count} Jobs</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: theme.colors.accent, textAlign: 'center' }}>Loading countries...</p>
        )}
      </div>


      {/* Footer */}
      <footer style={{ backgroundColor: theme.colors.secondaryBg, color: theme.colors.textPrimary, padding: '40px 100px', marginTop: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ color: theme.colors.accent, marginBottom: 12 }}>HIRIX</h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: theme.colors.textSecondary }}>Your trusted platform to explore top opportunities, connect with companies, and find your dream job faster.</p>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h3 style={{ color: theme.colors.accent, marginBottom: 12 }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, lineHeight: 2 }}>
              <li><Link to="/" style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/jobs" style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}>Find Jobs</Link></li>
              <li><Link to="/about" style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}>About</Link></li>
              <li><Link to="/contact" style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}>Contact</Link></li>
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h3 style={{ color: theme.colors.accent, marginBottom: 12 }}>Get in Touch</h3>
            <p style={{ fontSize: 14, marginBottom: 6, color: theme.colors.textSecondary }}>Email: support@jobtracker.com</p>
            <p style={{ fontSize: 14, marginBottom: 12, color: theme.colors.textSecondary }}>Phone: +92 300 1234567</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" style={{ fontSize: 20, color: theme.colors.accent }}></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter" style={{ fontSize: 20, color: theme.colors.accent }}></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin" style={{ fontSize: 20, color: theme.colors.accent }}></i></a>
            </div>
          </div>
        </div>
        <hr style={{ margin: '30px 0', borderColor: theme.colors.border }} />
        <div style={{ textAlign: 'center', fontSize: 13, color: theme.colors.textSecondary }}>
          © {new Date().getFullYear()} JobTracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
