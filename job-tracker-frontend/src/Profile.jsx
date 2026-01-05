import React from 'react';
import { Layout, Card, Avatar, Typography, Tag, Row, Col, Button, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LinkedinOutlined,
  GithubOutlined,
  GlobalOutlined,
  EditOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import { useTheme } from './ThemeContext';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const { theme } = useTheme();

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return names[0].charAt(0);
  };

  const userProfile = {
    name: user.name || 'User Name',
    email: user.email || 'user@example.com',
    phone: user.phone || 'Not provided',
    address: user.address || 'Not provided',
    bio: user.bio || 'No bio available',
    skills: user.skills || ['JavaScript', 'React', 'Node.js', 'Python'],
    experience: user.experience || 'Not provided',
    education: user.education || 'Not provided',
    linkedin: user.linkedin || '',
    github: user.github || '',
    website: user.website || ''
  };

  return (
    <Layout style={{ background: 'transparent', minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '40px 100px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 30, textAlign: 'center' }}>
            <Title level={2} style={{ color: theme.colors.accent, margin: 0 }}>
              User Profile
            </Title>
            <Text style={{ color: theme.colors.textPrimary, fontSize: 16 }}>
              View and manage your profile information
            </Text>
          </div>

          {/* Main Profile Card */}
          <Card
            style={{
              borderRadius: 16,
              backgroundColor: theme.colors.secondaryBg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              marginBottom: 24
            }}
          >
            <Row gutter={[32, 32]}>
              {/* Left Column - Avatar and Basic Info */}
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar
                    size={150}
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.primaryBg,
                      fontSize: 60,
                      fontWeight: 'bold',
                      marginBottom: 20
                    }}
                  >
                    {getUserInitials(userProfile.name)}
                  </Avatar>
                  <Title level={3} style={{ color: theme.colors.accent, margin: 0 }}>
                    {userProfile.name}
                  </Title>
                  <Text style={{ color: theme.colors.textPrimary, fontSize: 16, display: 'block', marginTop: 8 }}>
                    {userProfile.email}
                  </Text>

                  <div style={{ marginTop: 20 }}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate('/dashboard')}
                      style={{
                        backgroundColor: theme.colors.accent,
                        color: theme.colors.primaryBg,
                        border: 'none',
                        borderRadius: 8,
                        height: 40,
                        fontWeight: 'bold',
                        marginRight: 12
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      style={{
                        backgroundColor: theme.colors.cardBg,
                        color: theme.colors.accent,
                        border: `1px solid ${theme.colors.accent}`,
                        borderRadius: 8,
                        height: 40
                      }}
                    >
                      Download CV
                    </Button>
                  </div>
                </div>
              </Col>

              {/* Right Column - Detailed Information */}
              <Col xs={24} md={16}>
                <div style={{ height: '100%' }}>
                  {/* Contact Information */}
                  <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ color: theme.colors.accent, marginBottom: 16 }}>
                      Contact Information
                    </Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MailOutlined style={{ color: theme.colors.accent, marginRight: 12, fontSize: 16 }} />
                        <Text style={{ color: theme.colors.textPrimary }}>{userProfile.email}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneOutlined style={{ color: theme.colors.accent, marginRight: 12, fontSize: 16 }} />
                        <Text style={{ color: theme.colors.textPrimary }}>{userProfile.phone}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <HomeOutlined style={{ color: theme.colors.accent, marginRight: 12, fontSize: 16 }} />
                        <Text style={{ color: theme.colors.textPrimary }}>{userProfile.address}</Text>
                      </div>
                    </div>
                  </div>

                  <Divider style={{ borderColor: theme.colors.border }} />

                  {/* Bio */}
                  <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ color: theme.colors.accent, marginBottom: 16 }}>
                      About
                    </Title>
                    <Paragraph style={{ color: theme.colors.textPrimary, lineHeight: 1.6 }}>
                      {userProfile.bio}
                    </Paragraph>
                  </div>

                  <Divider style={{ borderColor: theme.colors.border }} />

                  {/* Skills */}
                  <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ color: theme.colors.accent, marginBottom: 16 }}>
                      Skills
                    </Title>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {userProfile.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          style={{
                            backgroundColor: theme.colors.secondaryBg,
                            color: theme.colors.textPrimary,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: 6,
                            padding: '4px 12px',
                            fontSize: 14
                          }}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Additional Information Cards */}
          <Row gutter={[24, 24]}>
            {/* Professional Information */}
            <Col xs={24} md={12}>
              <Card
                title={<span style={{ color: theme.colors.accent }}>Professional Information</span>}
                style={{
                  borderRadius: 12,
                  backgroundColor: theme.colors.secondaryBg,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                headStyle={{ borderBottom: `1px solid ${theme.colors.border}` }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <Text style={{ color: theme.colors.accent, fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
                      Experience
                    </Text>
                    <Text style={{ color: theme.colors.textPrimary }}>{userProfile.experience}</Text>
                  </div>
                  <div>
                    <Text style={{ color: theme.colors.accent, fontWeight: 'bold', display: 'block', marginBottom: 4 }}>
                      Education
                    </Text>
                    <Text style={{ color: theme.colors.textPrimary }}>{userProfile.education}</Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Social Links */}
            <Col xs={24} md={12}>
              <Card
                title={<span style={{ color: theme.colors.accent }}>Social Links</span>}
                style={{
                  borderRadius: 12,
                  backgroundColor: theme.colors.secondaryBg,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                headStyle={{ borderBottom: `1px solid ${theme.colors.border}` }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {userProfile.linkedin && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <LinkedinOutlined style={{ color: theme.colors.accent, marginRight: 12, fontSize: 16 }} />
                      <a
                        href={userProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {userProfile.github && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <GithubOutlined style={{ color: theme.colors.accent, marginRight: 12, fontSize: 16 }} />
                      <a
                        href={userProfile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  {userProfile.website && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <GlobalOutlined style={{ color: theme.colors.accent, marginRight: 12, fontSize: 16 }} />
                      <a
                        href={userProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.colors.textPrimary, textDecoration: 'none' }}
                      >
                        Personal Website
                      </a>
                    </div>
                  )}
                  {!userProfile.linkedin && !userProfile.github && !userProfile.website && (
                    <Text style={{ color: theme.colors.textSecondary, fontStyle: 'italic' }}>
                      No social links added yet
                    </Text>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;