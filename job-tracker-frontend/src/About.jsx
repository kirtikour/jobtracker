import React from 'react';
import { Layout, Typography, Card, Row, Col } from 'antd';
import { 
  RocketOutlined, 
  TeamOutlined, 
  TrophyOutlined, 
  StarOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const About = () => {
  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: 32, color: '#c1ff72' }} />,
      title: 'Smart Job Tracking',
      description: 'Track your job applications with detailed status updates, interview scheduling, and progress monitoring.'
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: '#c1ff72' }} />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized job recommendations based on your skills, experience, and preferences.'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 32, color: '#c1ff72' }} />,
      title: 'Interview Preparation',
      description: 'Practice with interactive quizzes and mock interviews to boost your confidence.'
    },
    {
      icon: <StarOutlined style={{ fontSize: 32, color: '#c1ff72' }} />,
      title: 'Performance Analytics',
      description: 'Track your application success rates and identify areas for improvement.'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#033f47' }}>
      <Navbar />
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Hero Section */}
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #022e38 0%, #044956 100%)',
            borderRadius: 20,
            marginBottom: 60,
            border: '1px solid #066a7a'
          }}>
            <Title level={1} style={{ color: '#c1ff72', marginBottom: 20 }}>
              About HIRIX
            </Title>
            <Paragraph style={{ 
              color: '#d7f5e7', 
              fontSize: 18, 
              maxWidth: 800, 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              HIRIX is a comprehensive job tracking and career development platform that helps job seekers 
              streamline their application process, prepare for interviews, and achieve their career goals 
              with data-driven insights and personalized recommendations.
            </Paragraph>
          </div>

          {/* Features Section */}
          <div style={{ marginBottom: 60 }}>
            <Title level={2} style={{ color: '#c1ff72', textAlign: 'center', marginBottom: 40 }}>
              What HIRIX Does
            </Title>
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card style={{ 
                    backgroundColor: '#022e38', 
                    border: '1px solid #044956',
                    borderRadius: 16,
                    height: '100%',
                    textAlign: 'center'
                  }}>
                    <div style={{ marginBottom: 16 }}>
                      {feature.icon}
                    </div>
                    <Title level={4} style={{ color: '#d7f5e7', marginBottom: 12 }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ color: '#a0a0a0', margin: 0 }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

        </div>
      </Content>
    </Layout>
  );
};

export default About; 