import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input, Badge, Spin } from 'antd';
import { EnvironmentOutlined, ApartmentOutlined } from '@ant-design/icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

import { useTheme } from './ThemeContext';

const { Search } = Input;

const Companies = () => {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobCounts, setJobCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://remoteok.com/api');
        const data = await response.json();

        const jobs = data.filter((job) => job.company);

        const countMap = {};
        jobs.forEach((job) => {
          countMap[job.company] = (countMap[job.company] || 0) + 1;
        });

        const uniqueCompanies = Array.from(
          new Map(jobs.map((job) => [job.company, job])).values()
        ).map((job) => ({
          name: job.company,
          location: job.location || 'Remote',
          logo: job.company_logo || '',
        }));

        setCompanies(uniqueCompanies);
        setJobCounts(countMap);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: '40px',
          backgroundColor: 'transparent',
          minHeight: '100vh',
        }}
      >
        <h2 style={{ color: theme.colors.accent, marginBottom: 20 }}>Popular Companies</h2>

        <Search
          placeholder="Search Companies"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          enterButton="Search"
          style={{
            width: '100%',
            marginBottom: 30,
            backgroundColor: theme.colors.cardBg,
            borderRadius: 8,
            overflow: 'hidden',
          }}
          size="large"
          allowClear
        />

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredCompanies.map((company, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`${company.name}-${index}`}>
                <Link to={`/jobs?company=${encodeURIComponent(company.name)}`}>
                  <div
                    data-aos="fade-up"
                    style={{
                      position: 'relative',
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Job Count Badge (Top Right) */}
                    <Badge
                      count={jobCounts[company.name] || 0}
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -7,
                        zIndex: 2,
                        backgroundColor: theme.colors.accent,
                        color: theme.colors.primaryBg,
                        fontWeight: 'bold',
                        boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                      }}
                    />

                    {/* Company Card */}
                    <Card
                      hoverable
                      style={{
                        backgroundColor: theme.colors.secondaryBg,
                        color: theme.colors.textPrimary,
                        borderRadius: 16,
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: 10,
                        height: 260,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        border: `1px solid ${theme.colors.border}`,
                      }}
                      headStyle={{ borderBottom: 'none' }}
                    >
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'defaultLogo.png';
                          }}
                          style={{
                            width: 90,
                            height: 70,
                            objectFit: 'contain',
                            margin: '0 auto 12px',
                            backgroundColor: '#fff',
                            padding: 6,
                            borderRadius: 10,
                          }}
                        />
                      ) : (
                        <ApartmentOutlined
                          style={{
                            fontSize: 48,
                            color: theme.colors.accent,
                            marginBottom: 12,
                          }}
                        />
                      )}

                      <h4
                        style={{
                          color: theme.colors.accent,
                          fontSize: 16,
                          marginBottom: 6,
                        }}
                      >
                        {company.name}
                      </h4>
                      <p style={{ color: theme.colors.textPrimary, fontSize: 13, margin: 0 }}>
                        <EnvironmentOutlined /> {company.location}
                      </p>
                    </Card>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
};

export default Companies;
