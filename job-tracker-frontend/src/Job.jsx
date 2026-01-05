import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Button, Spin, Tag, Slider, Radio, Row, Col, Space, Card, Switch, Badge, Tooltip, Modal, Form, message } from 'antd';
import { SearchOutlined, DollarOutlined, EnvironmentOutlined, CalendarOutlined, PlusOutlined, BellOutlined, FilterOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import Navbar from './Navbar';
import JobCard from './JobCard';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import CSS for animations

const { Option } = Select;
const { Content } = Layout;
import { useTheme } from './ThemeContext';

const Job = () => {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [jobAlerts, setJobAlerts] = useState([]);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertForm] = Form.useForm();

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedCompany = queryParams.get('company');
  const selectedCountry = queryParams.get('country');
  const searchParam = queryParams.get('search');

  // Enhanced Filters
  const [remoteFilter, setRemoteFilter] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [jobField, setJobField] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchTerm, setSearchTerm] = useState(searchParam || '');

  const jobFields = [
    { value: 'all', label: 'All Fields' },
    { value: 'cs', label: 'Computer Science' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'data', label: 'Data Science' },
    { value: 'product', label: 'Product Management' },
  ];

  const experienceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'manager', label: 'Manager' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date Posted' },
    { value: 'salary', label: 'Salary' },
    { value: 'company', label: 'Company' },
  ];

  // Load favorites from backend
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/users/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const favoritesData = await response.json();
          setFavorites(favoritesData.map(fav => fav.jobId));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();

    const savedAlerts = localStorage.getItem('jobAlerts');
    if (savedAlerts) {
      setJobAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('jobAlerts', JSON.stringify(jobAlerts));
  }, [jobAlerts]);

  // Fetch jobs from RemoteOK API with enhanced error handling
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://remoteok.com/api');
        const data = await response.json();

        // Enhanced job processing
        const jobList = data.slice(1)
          .filter(job => job.position && job.company)
          .map(job => ({
            ...job,
            id: job.id || Math.random().toString(36).substr(2, 9),
            salary: job.salary || 'Not specified',
            experience: determineExperienceLevel(job.position),
            postedDate: job.date || new Date().toISOString(),
            isFavorite: favorites.includes(job.id || job.position + job.company)
          }));

        setJobs(jobList);
        setFilteredJobs(jobList);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        message.error('Failed to load jobs. Please try again later.');
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [favorites]);

  // Determine experience level from job title
  const determineExperienceLevel = (position) => {
    const title = position.toLowerCase();
    if (title.includes('senior') || title.includes('lead') || title.includes('manager') || title.includes('director')) {
      return 'senior';
    } else if (title.includes('mid') || title.includes('intermediate')) {
      return 'mid';
    } else if (title.includes('junior') || title.includes('entry') || title.includes('graduate')) {
      return 'entry';
    } else {
      return 'mid'; // Default
    }
  };

  // Apply enhanced filters
  useEffect(() => {
    applyFilters();
  }, [remoteFilter, jobType, jobField, experienceLevel, salaryRange, searchTerm, jobs, showFavoritesOnly, sortBy, searchParam]);

  const applyFilters = () => {
    let result = [...jobs];

    // Company filter
    if (selectedCompany) {
      result = result.filter((job) => job.company === selectedCompany);
    }

    // Country/Location filter
    if (selectedCountry) {
      result = result.filter((job) => {
        const jobLocation = (job.location || '').toLowerCase();
        const country = selectedCountry.toLowerCase();

        if (country === 'remote') {
          return !jobLocation || jobLocation.includes('remote');
        } else if (country === 'usa') {
          return jobLocation.includes('united states') || jobLocation.includes('usa') || jobLocation.includes('us');
        } else if (country === 'new york') {
          return jobLocation.includes('new york');
        } else if (country === 'california') {
          return jobLocation.includes('california');
        } else if (country === 'austin') {
          return jobLocation.includes('austin');
        } else if (country === 'sao paulo') {
          return jobLocation.includes('sao paulo') || jobLocation.includes('brazil');
        } else if (country === 'toronto') {
          return jobLocation.includes('toronto') || jobLocation.includes('canada');
        } else if (country === 'london') {
          return jobLocation.includes('london') || jobLocation.includes('united kingdom') || jobLocation.includes('uk');
        } else {
          return jobLocation.includes(country);
        }
      });
    }

    // Search term filter
    const searchQuery = searchTerm || searchParam;
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          (job.position && job.position.toLowerCase().includes(term)) ||
          (job.company && job.company.toLowerCase().includes(term)) ||
          (job.description && job.description.toLowerCase().includes(term))
      );
    }

    // Remote filter
    if (remoteFilter !== 'all') {
      result = result.filter((job) => {
        const isRemote = !job.location || job.location.toLowerCase().includes('remote');
        return remoteFilter === 'remote' ? isRemote : !isRemote;
      });
    }

    // Job field filter
    if (jobField !== 'all') {
      result = result.filter((job) => {
        const position = (job.position || '').toLowerCase();
        const description = (job.description || '').toLowerCase();

        switch (jobField) {
          case 'cs':
            return (
              position.includes('developer') ||
              position.includes('engineer') ||
              position.includes('software') ||
              position.includes('programmer') ||
              position.includes('full stack') ||
              position.includes('frontend') ||
              position.includes('backend') ||
              position.includes('devops') ||
              position.includes('data engineer')
            );
          case 'marketing':
            return (
              position.includes('marketing') ||
              position.includes('growth') ||
              position.includes('seo') ||
              position.includes('content') ||
              position.includes('social media')
            );
          case 'design':
            return (
              position.includes('designer') ||
              position.includes('ui') ||
              position.includes('ux') ||
              position.includes('graphic') ||
              position.includes('product design')
            );
          case 'data':
            return (
              position.includes('data') ||
              position.includes('analyst') ||
              position.includes('scientist') ||
              position.includes('ml') ||
              position.includes('ai')
            );
          case 'product':
            return (
              position.includes('product') ||
              position.includes('pm') ||
              position.includes('manager')
            );
          default:
            return true;
        }
      });
    }

    // Experience level filter
    if (experienceLevel !== 'all') {
      result = result.filter((job) => job.experience === experienceLevel);
    }

    // Salary filter (basic implementation)
    if (salaryRange[0] > 0 || salaryRange[1] < 200000) {
      result = result.filter((job) => {
        // This is a simplified salary filter - in real implementation you'd parse salary strings
        return true; // For now, show all jobs
      });
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((job) => favorites.includes(job.id));
    }

    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.postedDate) - new Date(a.postedDate);
        case 'salary':
          // Simplified sorting - in real implementation you'd parse salary
          return 0;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0; // Relevance - keep original order
      }
    });

    setFilteredJobs(result);
  };

  // Toggle favorite
  const toggleFavorite = async (job) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        message.error('Please login to save favorites');
        return;
      }

      if (favorites.includes(job.id)) {
        // Remove from favorites
        const response = await fetch(`http://localhost:5000/api/users/favorites/${job.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setFavorites(prev => prev.filter(id => id !== job.id));
          message.success('Removed from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch('http://localhost:5000/api/users/favorites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jobId: job.id,
            jobTitle: job.position,
            company: job.company,
            location: job.location || 'Remote',
            jobUrl: job.url || ''
          })
        });

        if (response.ok) {
          setFavorites(prev => [...prev, job.id]);
          message.success('Added to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Failed to update favorites');
    }
  };

  // Create job alert
  const createJobAlert = async (values) => {
    const newAlert = {
      id: Date.now(),
      ...values,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setJobAlerts(prev => [...prev, newAlert]);
    setAlertModalVisible(false);
    alertForm.resetFields();
    message.success('Job alert created successfully!');
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setRemoteFilter('all');
    setJobType('all');
    setJobField('all');
    setExperienceLevel('all');
    setSalaryRange([0, 200000]);
    setShowFavoritesOnly(false);
    setSortBy('relevance');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar />

      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <div className="header-section" style={{ marginBottom: 24 }}>
            <h1 style={{ color: theme.colors.accent, fontSize: 32, marginBottom: 8 }}>🔍 Find Your Dream Job</h1>
            <p style={{ color: theme.colors.textSecondary, fontSize: 16 }}>Discover thousands of remote and local opportunities</p>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="job-filter" style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}`, marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Input
                  size="large"
                  placeholder="Search jobs, companies, or keywords..."
                  prefix={<SearchOutlined style={{ color: '#c1ff72' }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                />
              </Col>
              <Col xs={24} md={4}>
                <Select
                  size="large"
                  placeholder="Remote"
                  value={remoteFilter}
                  onChange={setRemoteFilter}
                  style={{ width: '100%', backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
                >
                  <Option value="all">🌍 All</Option>
                  <Option value="remote">🏠 Remote</Option>
                  <Option value="onsite">🏢 On-site</Option>
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Select
                  size="large"
                  placeholder="Field"
                  value={jobField}
                  onChange={setJobField}
                  style={{ width: '100%', backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
                >
                  {jobFields.map(field => (
                    <Option key={field.value} value={field.value}>{field.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Select
                  size="large"
                  placeholder="Experience"
                  value={experienceLevel}
                  onChange={setExperienceLevel}
                  style={{ width: '100%', backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
                >
                  {experienceLevels.map(level => (
                    <Option key={level.value} value={level.value}>{level.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Select
                  size="large"
                  placeholder="Sort by"
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: '100%', backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
                >
                  {sortOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {/* Additional Filters */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} md={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch
                    checked={showFavoritesOnly}
                    onChange={setShowFavoritesOnly}
                    style={{ backgroundColor: showFavoritesOnly ? '#c1ff72' : '#044956' }}
                  />
                  <span style={{ color: '#d7f5e7' }}>Show Favorites Only</span>
                </div>
              </Col>
              <Col xs={24} md={6}>
                <Button
                  icon={<BellOutlined />}
                  onClick={() => setAlertModalVisible(true)}
                  style={{
                    backgroundColor: '#c1ff72',
                    borderColor: '#c1ff72',
                    color: '#033f47',
                    fontWeight: 'bold'
                  }}
                >
                  Create Alert
                </Button>
              </Col>
              <Col xs={24} md={6}>
                <Button
                  icon={<FilterOutlined />}
                  onClick={resetFilters}
                  style={{
                    backgroundColor: '#044956',
                    borderColor: '#044956',
                    color: '#d7f5e7'
                  }}
                >
                  Reset Filters
                </Button>
              </Col>
              <Col xs={24} md={6}>
                <Badge count={jobAlerts.filter(alert => alert.isActive).length} showZero>
                  <Button
                    icon={<BellOutlined />}
                    style={{
                      backgroundColor: '#044956',
                      borderColor: '#044956',
                      color: '#d7f5e7'
                    }}
                  >
                    Alerts
                  </Button>
                </Badge>
              </Col>
            </Row>
          </Card>

          {/* Results Summary */}
          <div className="dashboard-card" style={{ marginBottom: 16 }}>
            <span style={{ color: '#d7f5e7' }}>
              Showing {filteredJobs.length} of {jobs.length} jobs
            </span>
            {favorites.length > 0 && (
              <span style={{ color: '#c1ff72', marginLeft: 16 }}>
                ⭐ {favorites.length} favorites
              </span>
            )}
          </div>

          {/* Job Listings */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin size="large" />
              <p style={{ color: '#d7f5e7', marginTop: 16 }}>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card className="dashboard-card" style={{ backgroundColor: '#022e38', border: '1px solid #044956', textAlign: 'center' }}>
              <p style={{ color: '#d7f5e7', fontSize: 18 }}>No jobs found matching your criteria</p>
              <Button onClick={resetFilters} style={{ marginTop: 16 }}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
              {filteredJobs.map((job, index) => (
                <Card
                  key={job.id}
                  className="job-card"
                  style={{
                    backgroundColor: theme.colors.secondaryBg,
                    border: `1px solid ${theme.colors.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    animationDelay: `${index * 0.1}s`
                  }}
                  hoverable
                  onClick={() => navigate(`/job/${job.id}`)}
                  extra={
                    <Tooltip title={favorites.includes(job.id) ? 'Remove from favorites' : 'Add to favorites'}>
                      <Button
                        type="text"
                        icon={favorites.includes(job.id) ? <StarFilled style={{ color: '#c1ff72' }} /> : <StarOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(job);
                        }}
                      />
                    </Tooltip>
                  }
                >
                  <div>
                    <h3 style={{ color: theme.colors.accent, marginBottom: 8 }}>{job.position}</h3>
                    <p style={{ color: theme.colors.textPrimary, marginBottom: 8 }}>{job.company}</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <Tag color="blue">{job.location || 'Remote'}</Tag>
                      <Tag color="green">{job.experience}</Tag>
                    </div>
                    <p style={{ color: '#a0a0a0', fontSize: 12 }}>
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Content>

      {/* Job Alert Modal */}
      <Modal
        title={<span style={{ color: '#c1ff72' }}>🔔 Create Job Alert</span>}
        open={alertModalVisible}
        onCancel={() => setAlertModalVisible(false)}
        footer={null}
        styles={{
          content: { backgroundColor: '#022e38', border: '1px solid #04454f' },
          header: { backgroundColor: '#022e38', borderBottom: '1px solid #04454f' }
        }}
      >
        <Form
          form={alertForm}
          layout="vertical"
          onFinish={createJobAlert}
        >
          <Form.Item
            name="keywords"
            label={<span style={{ color: '#c1ff72' }}>Keywords</span>}
            rules={[{ required: true, message: 'Please enter keywords!' }]}
          >
            <Input
              placeholder="e.g., React, JavaScript, Remote"
              style={{
                backgroundColor: '#044956',
                border: '1px solid #044956',
                color: '#d7f5e7'
              }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label={<span style={{ color: '#c1ff72' }}>Location</span>}
          >
            <Input
              placeholder="e.g., Remote, New York"
              style={{
                backgroundColor: '#044956',
                border: '1px solid #044956',
                color: '#d7f5e7'
              }}
            />
          </Form.Item>

          <Form.Item
            name="frequency"
            label={<span style={{ color: '#c1ff72' }}>Alert Frequency</span>}
            initialValue="daily"
          >
            <Select
              style={{
                backgroundColor: '#044956',
                border: '1px solid #044956',
                color: '#d7f5e7'
              }}
            >
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => setAlertModalVisible(false)}
                style={{
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
                  fontWeight: 'bold'
                }}
              >
                Create Alert
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Job;
