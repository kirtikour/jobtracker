import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Tag, Typography, Statistic, Button, Avatar, List, Menu, Divider, Upload, Progress, Space } from 'antd';
import { 
  AppstoreOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  PlusOutlined,
  LockOutlined,
  UploadOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('applications');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate statistics
  const applications = user.applications || [];
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'Applied' || app.status === 'Pending Test').length;
  const interviewApplications = applications.filter(app => app.status === 'Interview').length;
  const offerApplications = applications.filter(app => app.status === 'Offer').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return '#1677ff';
      case 'Pending Test': return '#faad14';
      case 'Interview': return '#52c41a';
      case 'Offer': return '#52c41a';
      case 'Rejected': return '#ff4d4f';
      default: return '#1677ff';
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return names[0].charAt(0);
  };

  const sidebarMenuItems = [
    {
      key: 'applications',
      icon: <AppstoreOutlined />,
      label: 'My Applications',
    },
    {
      key: 'cv',
      icon: <FileTextOutlined />,
      label: 'My CV',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Edit Profile',
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: 'Change Password',
    },
  ];

  const renderMyApplications = () => (
    <div>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              backgroundColor: '#022e38',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic 
              title={<span style={{ color: '#d7f5e7' }}>Total Applications</span>} 
              value={totalApplications} 
              valueStyle={{ color: '#c1ff72' }}
              prefix={<AppstoreOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              backgroundColor: '#022e38',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic 
              title={<span style={{ color: '#d7f5e7' }}>Pending</span>} 
              value={pendingApplications} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              backgroundColor: '#022e38',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic 
              title={<span style={{ color: '#d7f5e7' }}>Interviews</span>} 
              value={interviewApplications} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              backgroundColor: '#022e38',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic 
              title={<span style={{ color: '#d7f5e7' }}>Offers</span>} 
              value={offerApplications} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      {/* Applications List */}
      <Card 
        title={<span style={{ color: '#c1ff72', fontSize: 18, fontWeight: 'bold' }}>My Applications</span>}
        extra={
          <Text style={{ color: '#d7f5e7' }}>
            You have applied for {totalApplications} jobs below through RozeeGPT.
          </Text>
        }
        style={{ 
          borderRadius: 12, 
          backgroundColor: '#022e38',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        headStyle={{ borderBottom: '1px solid #044956' }}
      >
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileTextOutlined style={{ fontSize: 48, color: '#044956', marginBottom: 16 }} />
            <Title level={4} style={{ color: '#d7f5e7' }}>No Applications Yet</Title>
            <Text style={{ color: '#a0c9c0' }}>
              You haven't applied to any jobs yet. Start exploring opportunities!
            </Text>
            <br />
            <Button 
              type="primary" 
              style={{ 
                marginTop: 16,
                backgroundColor: '#c1ff72', 
                color: '#033f47', 
                border: 'none',
                borderRadius: 8
              }}
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <Row style={{ marginBottom: 16, padding: '0 16px' }}>
              <Col span={8}>
                <Text style={{ color: '#c1ff72', fontWeight: 'bold' }}>Job Title</Text>
              </Col>
              <Col span={8}>
                <Text style={{ color: '#c1ff72', fontWeight: 'bold' }}>Company</Text>
              </Col>
              <Col span={8}>
                <Text style={{ color: '#c1ff72', fontWeight: 'bold' }}>Date</Text>
              </Col>
            </Row>
            <Divider style={{ borderColor: '#044956', margin: '0 0 16px 0' }} />
            
            {/* Applications */}
            {applications.map(item => (
              <div key={item.id} style={{ marginBottom: 16 }}>
                <Row align="middle" style={{ padding: '12px 16px' }}>
                  <Col span={8}>
                    <div>
                      <Text style={{ color: '#c1ff72', fontWeight: 'bold', fontSize: 16 }}>
                        {item.position}
                      </Text>
                      <br />
                      <Tag 
                        style={{ 
                          backgroundColor: getStatusColor(item.status),
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          marginTop: 4
                        }}
                      >
                        {item.status}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text style={{ color: '#d7f5e7', fontSize: 16 }}>{item.company}</Text>
                  </Col>
                  <Col span={8}>
                    <Text style={{ color: '#a0c9c0' }}>{item.date}</Text>
                  </Col>
                </Row>
                <Divider style={{ borderColor: '#044956', margin: '8px 0' }} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderMyCV = () => (
    <Card 
      title={<span style={{ color: '#c1ff72', fontSize: 18, fontWeight: 'bold' }}>My CV</span>}
      style={{ 
        borderRadius: 12, 
        backgroundColor: '#022e38',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      headStyle={{ borderBottom: '1px solid #044956' }}
    >
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <FileTextOutlined style={{ fontSize: 48, color: '#c1ff72', marginBottom: 16 }} />
        <Title level={4} style={{ color: '#d7f5e7' }}>Upload Your CV</Title>
        <Text style={{ color: '#a0c9c0', marginBottom: 24, display: 'block' }}>
          Upload your resume to apply for jobs quickly
        </Text>
        <Upload
          name="cv"
          accept=".pdf,.doc,.docx"
          showUploadList={false}
          beforeUpload={() => false}
        >
          <Button 
            icon={<UploadOutlined />}
            style={{ 
              backgroundColor: '#c1ff72', 
              color: '#033f47', 
              border: 'none',
              borderRadius: 8,
              height: 40,
              fontWeight: 'bold'
            }}
          >
            Upload CV
          </Button>
        </Upload>
        <div style={{ marginTop: 16 }}>
          <Text style={{ color: '#a0c9c0', fontSize: 12 }}>
            Supported formats: PDF, DOC, DOCX (Max 5MB)
          </Text>
        </div>
      </div>
    </Card>
  );

  const renderEditProfile = () => (
    <Card 
      title={<span style={{ color: '#c1ff72', fontSize: 18, fontWeight: 'bold' }}>Edit Profile</span>}
      style={{ 
        borderRadius: 12, 
        backgroundColor: '#022e38',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      headStyle={{ borderBottom: '1px solid #044956' }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ textAlign: 'center' }}>
            <Avatar 
              size={120} 
              style={{ 
                backgroundColor: '#c1ff72', 
                color: '#033f47',
                fontSize: 48,
                fontWeight: 'bold',
                marginBottom: 16
              }}
            >
              {getUserInitials(user.name)}
            </Avatar>
            <Button 
              type="primary" 
              style={{ 
                backgroundColor: '#044956', 
                color: '#c1ff72', 
                border: '1px solid #c1ff72',
                borderRadius: 8
              }}
            >
              Change Photo
            </Button>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Text style={{ color: '#c1ff72', fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
                Personal Information
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <UserOutlined style={{ color: '#c1ff72', marginRight: 10, width: 20 }} />
                <Text style={{ color: '#d7f5e7' }}>{user.name}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <MailOutlined style={{ color: '#c1ff72', marginRight: 10, width: 20 }} />
                <Text style={{ color: '#d7f5e7' }}>{user.email}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <PhoneOutlined style={{ color: '#c1ff72', marginRight: 10, width: 20 }} />
                <Text style={{ color: '#d7f5e7' }}>{user.phone}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <HomeOutlined style={{ color: '#c1ff72', marginRight: 10, width: 20 }} />
                <Text style={{ color: '#d7f5e7' }}>{user.address}</Text>
              </div>
            </div>
            
            <Divider style={{ borderColor: '#044956' }} />
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#c1ff72', fontWeight: 'bold' }}>Skills</Text>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  style={{ color: '#c1ff72' }}
                >
                  Edit
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {user.skills?.map((skill, index) => (
                  <Tag 
                    key={index}
                    style={{
                      backgroundColor: '#044956',
                      color: '#d7f5e7',
                      borderRadius: 4,
                      border: 'none'
                    }}
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>
            
            <Button 
              type="primary" 
              style={{ 
                marginTop: 20, 
                backgroundColor: '#c1ff72', 
                color: '#033f47',
                border: 'none',
                height: 40,
                fontWeight: 'bold',
                borderRadius: 8,
                alignSelf: 'flex-start'
              }}
            >
              Save Changes
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderChangePassword = () => (
    <Card 
      title={<span style={{ color: '#c1ff72', fontSize: 18, fontWeight: 'bold' }}>Change Password</span>}
      style={{ 
        borderRadius: 12, 
        backgroundColor: '#022e38',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: 500
      }}
      headStyle={{ borderBottom: '1px solid #044956' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <Text style={{ color: '#c1ff72', fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
            Current Password
          </Text>
          <input 
            type="password" 
            placeholder="Enter current password"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #044956',
              backgroundColor: '#044956',
              color: '#d7f5e7',
              fontSize: 14
            }}
          />
        </div>
        
        <div>
          <Text style={{ color: '#c1ff72', fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
            New Password
          </Text>
          <input 
            type="password" 
            placeholder="Enter new password"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #044956',
              backgroundColor: '#044956',
              color: '#d7f5e7',
              fontSize: 14
            }}
          />
        </div>
        
        <div>
          <Text style={{ color: '#c1ff72', fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
            Confirm New Password
          </Text>
          <input 
            type="password" 
            placeholder="Confirm new password"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #044956',
              backgroundColor: '#044956',
              color: '#d7f5e7',
              fontSize: 14
            }}
          />
        </div>
        
        <Button 
          type="primary" 
          style={{ 
            backgroundColor: '#c1ff72', 
            color: '#033f47',
            border: 'none',
            height: 40,
            fontWeight: 'bold',
            borderRadius: 8,
            marginTop: 10
          }}
        >
          Update Password
        </Button>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch(selectedMenuItem) {
      case 'applications':
        return renderMyApplications();
      case 'cv':
        return renderMyCV();
      case 'profile':
        return renderEditProfile();
      case 'password':
        return renderChangePassword();
      default:
        return renderMyApplications();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#033f47' }}>
      <Navbar />
      
      <Layout style={{ background: '#033f47' }}>
        {/* Sidebar */}
        <Sider 
          width={280}
          style={{ 
            background: '#022e38',
            borderRight: '1px solid #044956',
            padding: '20px 0'
          }}
        >
          {/* User Profile Section */}
          <div style={{ padding: '0 20px', marginBottom: 30 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: '#c1ff72', 
                  color: '#033f47',
                  fontSize: 32,
                  fontWeight: 'bold',
                  marginBottom: 12
                }}
              >
                {getUserInitials(user.name)}
              </Avatar>
              <Title level={5} style={{ color: '#c1ff72', margin: 0 }}>{user.name}</Title>
              <Text style={{ color: '#d7f5e7', fontSize: 12 }}>{user.email}</Text>
            </div>
          </div>
          
          <Divider style={{ borderColor: '#044956', margin: '0 20px 20px 20px' }} />
          
          {/* Navigation Menu */}
          <Menu
            mode="vertical"
            selectedKeys={[selectedMenuItem]}
            onClick={({ key }) => setSelectedMenuItem(key)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d7f5e7'
            }}
            items={sidebarMenuItems.map(item => ({
              ...item,
              style: {
                margin: '4px 20px',
                borderRadius: 8,
                height: 48,
                lineHeight: '48px',
                color: selectedMenuItem === item.key ? '#033f47' : '#d7f5e7',
                backgroundColor: selectedMenuItem === item.key ? '#c1ff72' : 'transparent'
              }
            }))}
          />
        </Sider>
        
        {/* Main Content */}
        <Content style={{ padding: '30px 40px', background: '#033f47' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;