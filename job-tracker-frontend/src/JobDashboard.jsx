import React from 'react';
import { Layout, Row, Col, Card, Tag, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const statusColumns = [
  { key: 'Applied', color: '#1677ff', title: 'Applied' },
  { key: 'Interviewing', color: '#faad14', title: 'Interviewing' },
  { key: 'Offer', color: '#52c41a', title: 'Offer' },
  { key: 'Rejected', color: '#ff4d4f', title: 'Rejected' },
];

const statusTagColor = {
  'Applied': 'blue',
  'Interviewing': 'orange',
  'Offer': 'green',
  'Rejected': 'red',
};

const JobDashboard = ({ jobs = [], onJobClick }) => {
  const getStatusJobs = (status) => jobs.filter((job) => job.status === status);

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', width: '100vw', background: 'linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)', overflow: 'auto' }}>
      <Header style={{ color: '#fff', fontSize: 28, background: 'transparent', textAlign: 'center', boxShadow: 'none', marginBottom: 24, width: '100vw' }}>
        <Title level={2} style={{ color: '#fff', margin: 0, padding: 16 }}>Job Applications Dashboard</Title>
      </Header>
      <Content style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100vw', minHeight: 'calc(100vh - 80px)' }}>
        <Row gutter={24} justify="center" style={{ height: '100%' }}>
          {statusColumns.map((col) => (
            <Col xs={24} sm={12} md={6} key={col.key} style={{ height: '100%' }}>
              <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 24, minHeight: 500, height: '100%' }}>
                <div style={{ background: col.color, color: '#fff', borderRadius: '12px 12px 0 0', padding: 16, fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>{col.title}</div>
                <div style={{ padding: 16 }}>
                  {getStatusJobs(col.key).map((job, idx) => (
                    <Card
                      key={job.company + job.title + idx}
                      style={{ marginBottom: 16, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer' }}
                      bodyStyle={{ padding: 16 }}
                      onClick={() => onJobClick && onJobClick(job)}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{job.company}</div>
                        <div style={{ color: '#888', fontSize: 14 }}>{job.title}</div>
                        <div style={{ margin: '8px 0' }}>
                          <Tag color={statusTagColor[job.status] || 'default'}>{job.status}</Tag>
                        </div>
                        <div style={{ fontSize: 13, color: '#aaa' }}>Applied: {job.date}</div>
                      </div>
                    </Card>
                  ))}
                  {getStatusJobs(col.key).length === 0 && (
                    <div style={{ color: '#bbb', textAlign: 'center', marginTop: 32 }}>No jobs in this column.</div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default JobDashboard; 