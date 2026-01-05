import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Tag, Modal, message, Row, Col, Typography, Divider, Avatar, Spin } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  LinkOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated) {
      checkApplicationStatus();
    }
  }, [jobId, isAuthenticated]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      // Fetch from RemoteOK API to get real job data
      const response = await fetch('https://remoteok.com/api');
      const data = await response.json();
      const jobList = data.slice(1).filter(job => job.position && job.company);

      // Find the specific job by ID or use the first one as fallback
      const foundJob = jobList.find(job => String(job.id) === jobId) || jobList[0];

      if (foundJob) {
        setJob({
          id: foundJob.id || jobId,
          title: foundJob.position,
          company: foundJob.company,
          logo: foundJob.company_logo,
          location: foundJob.location || 'Remote',
          type: 'Full-time',
          salary: foundJob.salary_min ? `$${foundJob.salary_min.toLocaleString()}+` : 'Competitive',
          postedDate: job?.date ? new Date(job.date).toLocaleDateString() : '',
          description: foundJob.description || `We are looking for a ${foundJob.position} to join our dynamic team.

Key Responsibilities:
• Develop and maintain applications using modern technologies
• Collaborate with cross-functional teams
• Write clean, maintainable, and efficient code
• Participate in code reviews and team meetings
• Stay up-to-date with emerging technologies

Requirements:
• Experience in relevant technologies
• Strong problem-solving skills
• Excellent communication and teamwork abilities
• Passion for learning and growth

Benefits:
• Competitive salary and benefits
• Flexible working arrangements
• Professional development opportunities
• Modern tech stack and tools`,
          tags: foundJob.tags || [foundJob.location || 'Remote', 'Full-time'],
          url: foundJob.url || '#',
          companyInfo: {
            size: '100-500 employees',
            industry: 'Technology',
            founded: '2015',
            website: foundJob.company_url || '#'
          }
        });
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      message.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    const token = localStorage.getItem('authToken');
    console.log('Checking application status for job:', jobId);
    console.log('Using token:', token ? 'Token exists' : 'No token');

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/check-application/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Check application response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Application status:', data);
        setHasApplied(data.hasApplied);
      } else {
        console.error('Failed to check application status:', response.status);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };
  const token = localStorage.getItem('authToken');
  console.log(token)
  console.log(Object.keys(localStorage));
  const handleApplyClick = () => {
    if (!isAuthenticated) {
      message.warning('Please log in to apply for this job');
      navigate('/auth');
      return;
    }

    if (hasApplied) {
      message.info('You have already applied for this job');
      return;
    }

    setIsModalVisible(true);
  };

  const handleConfirmApplication = async () => {
    setApplying(true);
    try {
      console.log('Submitting application for job:', job.id);

      // Save application to backend
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        jobUrl: job.url,
        notes: `Applied via JobTracker on ${new Date().toLocaleDateString()}`
      };

      const token = localStorage.getItem('authToken');
      console.log('Using token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:5000/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Application saved successfully:', result);

        setHasApplied(true);
        message.success('✅ Application saved to dashboard! Redirecting to job page...');
        setIsModalVisible(false);

        // Redirect to external job URL
        setTimeout(() => {
          window.open(job.url, '_blank');
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('Application failed:', errorData);
        message.error(`❌ ${errorData.message || 'Failed to submit application'}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('❌ Network error. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'C';
    return companyName.split(' ').map(word => word.charAt(0)).join('').substring(0, 2);
  };

  if (loading) {
    return (
      <Layout style={{ background: '#033f47', minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '40px 100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout style={{ background: '#033f47', minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ padding: '40px 100px' }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <Title level={3} style={{ color: '#c1ff72' }}>Job Not Found</Title>
            <Button
              type="primary"
              onClick={() => navigate('/jobs')}
              style={{ backgroundColor: '#c1ff72', color: '#033f47', border: 'none' }}
            >
              Back to Jobs
            </Button>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ background: '#033f47', minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '40px 100px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/jobs')}
          style={{
            backgroundColor: 'transparent',
            color: '#c1ff72',
            border: '1px solid #c1ff72',
            marginBottom: 24,
            borderRadius: 8
          }}
        >
          Back to Jobs
        </Button>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                backgroundColor: '#022e38',
                border: '1px solid #044956',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
                <Avatar
                  size={80}
                  src={job.logo}
                  style={{
                    backgroundColor: '#c1ff72',
                    color: '#033f47',
                    fontSize: 32,
                    fontWeight: 'bold',
                    marginRight: 20,
                    flexShrink: 0
                  }}
                >
                  {!job.logo && getCompanyInitials(job.company)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Title level={2} style={{ color: '#d7f5e7', margin: 0, marginBottom: 8 }}>
                    {job.title}
                  </Title>
                  <Title level={4} style={{ color: '#c1ff72', margin: 0, marginBottom: 16 }}>
                    {job.company}
                  </Title>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {job.tags?.map((tag, index) => (
                      <Tag key={index} color="blue" style={{ borderRadius: 12 }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>

              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#d7f5e7' }}>
                    <EnvironmentOutlined style={{ color: '#c1ff72', marginRight: 8 }} />
                    <Text style={{ color: '#d7f5e7' }}>{job.location}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#d7f5e7' }}>
                    <ClockCircleOutlined style={{ color: '#c1ff72', marginRight: 8 }} />
                    <Text style={{ color: '#d7f5e7' }}>{job.type}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#d7f5e7' }}>
                    <DollarOutlined style={{ color: '#c1ff72', marginRight: 8 }} />
                    <Text style={{ color: '#d7f5e7' }}>{job.salary}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#d7f5e7' }}>
                    <CalendarOutlined style={{ color: '#c1ff72', marginRight: 8 }} />
                    <Text style={{ color: '#d7f5e7' }}>Posted: {job.postedDate}</Text>
                  </div>
                </Col>
              </Row>

              <Divider style={{ borderColor: '#044956' }} />

              <div>
                <Title level={4} style={{ color: '#c1ff72', marginBottom: 16 }}>
                  Job Description
                </Title>
                <div
                  style={{ color: '#d7f5e7', lineHeight: 1.6, overflowWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              style={{
                backgroundColor: '#022e38',
                border: '1px solid #044956',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: 24
              }}
            >
              <Title level={4} style={{ color: '#c1ff72', marginBottom: 20 }}>
                Apply for this Job
              </Title>

              {hasApplied ? (
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined
                    style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }}
                  />
                  <Text style={{ color: '#d7f5e7', display: 'block', marginBottom: 16 }}>
                    You have already applied for this position
                  </Text>
                  <Button
                    type="primary"
                    onClick={() => navigate('/dashboard')}
                    style={{
                      backgroundColor: '#c1ff72',
                      color: '#033f47',
                      border: 'none',
                      borderRadius: 8,
                      height: 40,
                      fontWeight: 'bold',
                      width: '100%'
                    }}
                  >
                    View in Dashboard
                  </Button>
                </div>
              ) : (
                <div>
                  <Text style={{ color: '#d7f5e7', display: 'block', marginBottom: 20 }}>
                    Ready to take the next step in your career? Apply now and we'll save your application to your dashboard.
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleApplyClick}
                    style={{
                      backgroundColor: '#c1ff72',
                      color: '#033f47',
                      border: 'none',
                      borderRadius: 8,
                      height: 48,
                      fontWeight: 'bold',
                      width: '100%',
                      marginBottom: 12
                    }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    icon={<LinkOutlined />}
                    onClick={() => window.open(job.url, '_blank')}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#c1ff72',
                      border: '1px solid #c1ff72',
                      borderRadius: 8,
                      height: 40,
                      width: '100%'
                    }}
                  >
                    View Original Job
                  </Button>
                </div>
              )}
            </Card>

            <Card
              style={{
                backgroundColor: '#022e38',
                border: '1px solid #044956',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Title level={4} style={{ color: '#c1ff72', marginBottom: 20 }}>
                Company Information
              </Title>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <TeamOutlined style={{ color: '#c1ff72', marginRight: 8 }} />
                  <Text style={{ color: '#d7f5e7' }}>{job.companyInfo.size}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: '#c1ff72', marginRight: 8 }}>Industry:</Text>
                  <Text style={{ color: '#d7f5e7' }}>{job.companyInfo.industry}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: '#c1ff72', marginRight: 8 }}>Founded:</Text>
                  <Text style={{ color: '#d7f5e7' }}>{job.companyInfo.founded}</Text>
                </div>
              </div>

              <Button
                icon={<LinkOutlined />}
                onClick={() => window.open(job.companyInfo.website, '_blank')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#c1ff72',
                  border: '1px solid #c1ff72',
                  borderRadius: 8,
                  width: '100%'
                }}
              >
                Visit Company Website
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Application Confirmation Modal */}
        <Modal
          title={<span style={{ color: '#033f47' }}>Confirm Application</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Title level={4} style={{ color: '#033f47', marginBottom: 16 }}>
              Apply for {job.title} at {job.company}?
            </Title>
            <Text style={{ color: '#666', display: 'block', marginBottom: 24 }}>
              This will save the application to your dashboard and redirect you to the company's application page.
            </Text>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button
                onClick={() => setIsModalVisible(false)}
                style={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                loading={applying}
                onClick={handleConfirmApplication}
                style={{
                  backgroundColor: '#c1ff72',
                  color: '#033f47',
                  border: 'none',
                  minWidth: 100
                }}
              >
                Save & Apply
              </Button>
            </div>
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default JobDetail;