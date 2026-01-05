import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Typography,
  Space,
  Divider,
  List,
  Avatar,
  Empty
} from 'antd';
import {
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  StarOutlined,
  ThunderboltOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
import { useTheme } from './ThemeContext';

const AnalyticsDashboard = ({ applications = [], userProfile = {} }) => {
  const { theme } = useTheme();
  const [keyMetrics, setKeyMetrics] = useState({
    totalApplications: 0,
    interviewApplications: 0,
    offerApplications: 0,
    testApplications: 0,
    rejectedApplications: 0,
    interviewRate: 0,
    offerRate: 0,
    testRate: 0
  });

  // Calculate simple key metrics from real applications
  useEffect(() => {
    calculateKeyMetrics(applications);
  }, [applications]);

  const calculateKeyMetrics = (apps) => {
    const total = apps.length;
    const interviews = apps.filter(app => app.status === 'Interview').length;
    const offers = apps.filter(app => app.status === 'Offer').length;
    const tests = apps.filter(app => app.status === 'Pending Test').length;
    const rejected = apps.filter(app => app.status === 'Rejected').length;

    const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;
    const testRate = total > 0 ? Math.round((tests / total) * 100) : 0;

    setKeyMetrics({
      totalApplications: total,
      interviewApplications: interviews,
      offerApplications: offers,
      testApplications: tests,
      rejectedApplications: rejected,
      interviewRate,
      offerRate,
      testRate
    });
  };

  // Get recent applications for quick overview
  const recentApplications = applications
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);

  // Get top companies applied to
  const topCompanies = applications.reduce((acc, app) => {
    acc[app.company] = (acc[app.company] || 0) + 1;
    return acc;
  }, {});

  const topCompaniesList = Object.entries(topCompanies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([company, count]) => ({ company, count }));

  if (keyMetrics.totalApplications === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Empty
          description="No applications yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Text style={{ color: '#a0a0a0', marginTop: 16 }}>
          Start applying to jobs to see your analytics here!
        </Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ color: theme.colors.accent, marginBottom: 24 }}>
        📊 Your Application Analytics
      </Title>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.textPrimary }}>Total Applications</span>}
              value={keyMetrics.totalApplications}
              valueStyle={{ color: theme.colors.accent }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.textPrimary }}>Interviews</span>}
              value={keyMetrics.interviewApplications}
              valueStyle={{ color: '#faad14' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.textPrimary }}>Offers</span>}
              value={keyMetrics.offerApplications}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.textPrimary }}>Test Rate</span>}
              value={keyMetrics.testRate}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Success Rates */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            title={<span style={{ color: theme.colors.accent }}>Success Rates</span>}
            style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text style={{ color: theme.colors.textPrimary }}>Interview Rate</Text>
                <Progress
                  percent={keyMetrics.interviewRate}
                  strokeColor="#faad14"
                  trailColor={theme.colors.border}
                  showInfo={false}
                />
                <Text style={{ color: '#faad14', fontSize: 12 }}>
                  {keyMetrics.interviewRate}% of applications lead to interviews
                </Text>
              </div>
              <div>
                <Text style={{ color: theme.colors.textPrimary }}>Offer Rate</Text>
                <Progress
                  percent={keyMetrics.offerRate}
                  strokeColor="#52c41a"
                  trailColor={theme.colors.border}
                  showInfo={false}
                />
                <Text style={{ color: '#52c41a', fontSize: 12 }}>
                  {keyMetrics.offerRate}% of applications lead to offers
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={<span style={{ color: theme.colors.accent }}>Top Companies</span>}
            style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}
          >
            {topCompaniesList.length > 0 ? (
              <List
                dataSource={topCompaniesList}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Text style={{ color: theme.colors.textPrimary }}>{item.company}</Text>
                      <Tag color="blue">{item.count} applications</Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Text style={{ color: theme.colors.textSecondary }}>No company data available</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Applications */}
      <Card
        title={<span style={{ color: theme.colors.accent }}>Recent Applications</span>}
        style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}
      >
        {recentApplications.length > 0 ? (
          <List
            dataSource={recentApplications}
            renderItem={(app) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>
                      {app.jobTitle}
                    </Text>
                    <br />
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                      {app.company}
                    </Text>
                  </div>
                  <Tag color={getStatusColor(app.status)}>
                    {app.status}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text style={{ color: theme.colors.textSecondary }}>No recent applications</Text>
        )}
      </Card>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Applied': return 'blue';
    case 'Pending Test': return 'purple';
    case 'Interview': return 'orange';
    case 'Offer': return 'green';
    case 'Rejected': return 'red';
    default: return 'default';
  }
};

export default AnalyticsDashboard; 