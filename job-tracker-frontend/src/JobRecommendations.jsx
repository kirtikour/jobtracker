import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Space,
  Tag,
  List,
  Avatar,
  Progress,
  Row,
  Col,
  Statistic,
  message,
  Tooltip
} from 'antd';
import {
  StarOutlined,
  StarFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const { Title, Text } = Typography;
const { Content } = Layout;
import { useTheme } from './ThemeContext';

const JobRecommendations = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});
  const [favorites, setFavorites] = useState([]);

  // Load user profile and fetch recommendations
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfile();
      loadFavorites();
    }
  }, [isAuthenticated, user]);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
        generateRecommendations(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
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

  const generateRecommendations = async (profile) => {
    try {
      // Fetch jobs from RemoteOK
      const response = await fetch('https://remoteok.com/api');
      const data = await response.json();
      const jobs = data.slice(1).filter(job => job.position && job.company);

      // Generate recommendations based on profile
      const recommendations = jobs
        .map(job => ({
          ...job,
          id: job.id || Math.random().toString(36).substr(2, 9),
          matchScore: calculateMatchScore(job, profile),
          reasons: getMatchReasons(job, profile)
        }))
        .filter(job => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      message.error('Failed to load job recommendations');
    }
  };

  const calculateMatchScore = (job, profile) => {
    let score = 0;
    const jobTitle = job.position.toLowerCase();
    const jobDescription = (job.description || '').toLowerCase();
    const userSkills = (profile.skills || []).map(skill => skill.toLowerCase());
    const userExperience = (profile.experience || '').toLowerCase();

    // Skills matching (40% of score) - More realistic scoring
    let skillsMatched = 0;
    userSkills.forEach(skill => {
      if (jobTitle.includes(skill) || jobDescription.includes(skill)) {
        skillsMatched++;
      }
    });

    // Calculate skills score based on percentage of skills matched
    if (userSkills.length > 0) {
      const skillsPercentage = (skillsMatched / userSkills.length) * 40;
      score += Math.min(skillsPercentage, 40);
    }

    // Experience level matching (20% of score) - More nuanced
    const experienceKeywords = ['senior', 'lead', 'manager', 'director', 'junior', 'entry', 'mid', 'experienced'];
    const jobExperience = experienceKeywords.find(keyword =>
      jobTitle.includes(keyword) || jobDescription.includes(keyword)
    );

    if (userExperience.includes('senior') && (jobExperience === 'senior' || jobExperience === 'lead' || jobExperience === 'manager')) {
      score += 20;
    } else if (userExperience.includes('mid') && (jobExperience === 'mid' || jobExperience === 'experienced')) {
      score += 15;
    } else if (userExperience.includes('junior') && (jobExperience === 'junior' || jobExperience === 'entry')) {
      score += 20;
    } else if (jobExperience && userExperience) {
      // Partial match
      score += 8;
    }

    // Location preference (15% of score) - More flexible
    if (profile.address && job.location) {
      const userLocation = profile.address.toLowerCase();
      const jobLocation = job.location.toLowerCase();

      // Exact match
      if (userLocation.includes(jobLocation) || jobLocation.includes(userLocation)) {
        score += 15;
      }
      // Partial match (same country/region)
      else if (userLocation.includes('remote') || jobLocation.includes('remote')) {
        score += 10;
      }
    }

    // Company type preference (10% of score)
    if (profile.bio && job.company) {
      const userBio = profile.bio.toLowerCase();
      const companyName = job.company.toLowerCase();
      if (userBio.includes('startup') && companyName.includes('startup')) score += 10;
      else if (userBio.includes('enterprise') && companyName.includes('enterprise')) score += 10;
      else if (userBio.includes('remote') || userBio.includes('flexible')) score += 5;
    }

    // Job field relevance (15% of score)
    const jobFields = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'marketing', 'sales'];
    const userBio = (profile.bio || '').toLowerCase();
    const userSkillsText = userSkills.join(' ');

    jobFields.forEach(field => {
      if (jobTitle.includes(field) && (userBio.includes(field) || userSkillsText.includes(field))) {
        score += 5;
      }
    });

    // Add some randomness to make scores more realistic (0-3 points)
    const randomFactor = Math.random() * 3;
    score += randomFactor;

    return Math.min(Math.round(score), 85); // Cap at 85% for more realism
  };

  const getMatchReasons = (job, profile) => {
    const reasons = [];
    const jobTitle = job.position.toLowerCase();
    const jobDescription = (job.description || '').toLowerCase();
    const userSkills = (profile.skills || []).map(skill => skill.toLowerCase());

    // Skills match - more detailed
    const matchedSkills = userSkills.filter(skill =>
      jobTitle.includes(skill) || jobDescription.includes(skill)
    );
    if (matchedSkills.length > 0) {
      if (matchedSkills.length === 1) {
        reasons.push(`Matches your skill: ${matchedSkills[0]}`);
      } else if (matchedSkills.length <= 3) {
        reasons.push(`Matches your skills: ${matchedSkills.join(', ')}`);
      } else {
        reasons.push(`Matches ${matchedSkills.length} of your skills including ${matchedSkills.slice(0, 2).join(', ')}`);
      }
    }

    // Experience level - more nuanced
    if (profile.experience) {
      const userExp = profile.experience.toLowerCase();
      if (userExp.includes('senior') && (jobTitle.includes('senior') || jobTitle.includes('lead') || jobTitle.includes('manager'))) {
        reasons.push('Matches your senior experience level');
      } else if (userExp.includes('mid') && (jobTitle.includes('mid') || jobTitle.includes('experienced'))) {
        reasons.push('Matches your mid-level experience');
      } else if (userExp.includes('junior') && (jobTitle.includes('junior') || jobTitle.includes('entry'))) {
        reasons.push('Matches your junior experience level');
      } else if (userExp && (jobTitle.includes('senior') || jobTitle.includes('lead') || jobTitle.includes('manager'))) {
        reasons.push('Senior position - consider your experience level');
      }
    }

    // Location - more flexible
    if (profile.address && job.location) {
      const userLocation = profile.address.toLowerCase();
      const jobLocation = job.location.toLowerCase();
      if (userLocation.includes(jobLocation) || jobLocation.includes(userLocation)) {
        reasons.push('Location matches your preference');
      } else if (userLocation.includes('remote') || jobLocation.includes('remote')) {
        reasons.push('Remote work opportunity');
      }
    }

    // Company type
    if (profile.bio && job.company) {
      const userBio = profile.bio.toLowerCase();
      const companyName = job.company.toLowerCase();
      if (userBio.includes('startup') && companyName.includes('startup')) {
        reasons.push('Startup environment matches your preference');
      } else if (userBio.includes('enterprise') && companyName.includes('enterprise')) {
        reasons.push('Enterprise environment matches your preference');
      }
    }

    return reasons;
  };

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

  const getMatchColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    if (score >= 40) return '#1890ff';
    return '#ff4d4f';
  };

  const handleViewDetails = (job) => {
    // Generate a job ID (in a real app, this would come from the API)
    const jobId = job.id || `${job.company}-${job.position}`.replace(/\s+/g, '-').toLowerCase();
    navigate(`/job/${jobId}`);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', padding: '20px', textAlign: 'center' }}>
        <Title level={2} style={{ color: theme.colors.accent }}>
          Please login to see personalized job recommendations
        </Title>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', padding: '20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ color: theme.colors.accent, marginBottom: 24 }}>
          🎯 Personalized Job Recommendations
        </Title>

        {/* Profile Summary */}
        <Card
          title={<span style={{ color: theme.colors.accent }}>📋 Your Profile Summary</span>}
          style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}`, marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Statistic
                title={<span style={{ color: theme.colors.textPrimary }}>Skills</span>}
                value={userProfile.skills?.length || 0}
                valueStyle={{ color: theme.colors.accent }}
                prefix={<TrophyOutlined />}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<span style={{ color: theme.colors.textPrimary }}>Experience</span>}
                value={userProfile.experience || 'Not specified'}
                valueStyle={{ color: '#faad14' }}
                prefix={<UserOutlined />}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<span style={{ color: theme.colors.textPrimary }}>Location</span>}
                value={userProfile.address || 'Not specified'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<EnvironmentOutlined />}
              />
            </Col>
          </Row>
        </Card>

        {/* Recommendations */}
        {loading ? (
          <Card style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
            <Text style={{ color: theme.colors.textPrimary }}>Loading personalized recommendations...</Text>
          </Card>
        ) : recommendations.length === 0 ? (
          <Card style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
            <Text style={{ color: theme.colors.textPrimary }}>
              No recommendations found. Please update your profile with skills and experience.
            </Text>
          </Card>
        ) : (
          <div>
            <Title level={3} style={{ color: theme.colors.accent, marginBottom: 16 }}>
              Top Recommendations for You
            </Title>

            <div>
              {recommendations.map((job) => (
                <Card
                  key={job.id}
                  className="recommendation-card"
                  style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    backgroundColor: theme.colors.secondaryBg,
                    color: theme.colors.textPrimary,
                    minHeight: '70px',
                    padding: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    border: `1px solid ${theme.colors.border}`
                  }}
                  hoverable
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h3 style={{
                          color: theme.colors.accent,
                          margin: 0,
                          fontSize: '16px'
                        }}>{job.position}</h3>
                        <Tooltip title={favorites.includes(job.id) ? 'Remove from favorites' : 'Add to favorites'}>
                          <Button
                            type="text"
                            icon={favorites.includes(job.id) ? <StarFilled style={{ color: theme.colors.accent }} /> : <StarOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(job);
                            }}
                            style={{ color: theme.colors.textPrimary }}
                          />
                        </Tooltip>
                      </div>

                      <h4 style={{
                        margin: '2px 0',
                        color: theme.colors.textSecondary,
                        fontSize: '14px'
                      }}>{job.company}</h4>

                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <Tag color="blue">{job.location || 'Remote'}</Tag>
                        <Tag color="green">{job.type || 'Full-time'}</Tag>
                        <Tag color="purple" style={{ backgroundColor: getMatchColor(job.matchScore) }}>
                          {job.matchScore}% Match
                        </Tag>
                      </div>

                      {/* Match Reasons */}
                      {job.reasons.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                          <Text style={{ color: theme.colors.accent, fontSize: 11, fontWeight: 'bold' }}>
                            Why this matches you:
                          </Text>
                          <ul style={{ color: theme.colors.textSecondary, fontSize: 11, marginTop: 2, marginBottom: 0 }}>
                            {job.reasons.slice(0, 2).map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                      <Button
                        icon={<EyeOutlined />}
                        style={{
                          height: 32,
                          backgroundColor: 'transparent',
                          color: theme.colors.accent,
                          border: `1px solid ${theme.colors.accent}`,
                          borderRadius: 8,
                          fontSize: '13px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(job);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* View More Jobs Button */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button
                type="primary"
                size="large"
                onClick={() => window.location.href = '/jobs'}
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
                  height: 48,
                  fontSize: 16,
                  fontWeight: 'bold',
                  borderRadius: 8
                }}
              >
                🔍 View More Jobs
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobRecommendations; 