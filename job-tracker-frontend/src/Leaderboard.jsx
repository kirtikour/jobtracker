import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Typography,
  Select,
  Space,
  Row,
  Col,
  Statistic,
  Progress,
  Button,
  message,
  Spin,
  Avatar
} from 'antd';
import {
  TrophyOutlined,
  CrownOutlined,
  StarOutlined,
  UserOutlined,
  BarChartOutlined,
  TrophyFilled,
  ThunderboltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const Leaderboard = () => {
  const [selectedTopic, setSelectedTopic] = useState('frontend');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [userBestScore, setUserBestScore] = useState(null);
  const [userQuizHistory, setUserQuizHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const topics = [
    { key: 'all', label: 'All Topics', color: '#c1ff72' }
  ];

  const getTopicColor = (topic) => {
    const topicObj = topics.find(t => t.key === topic);
    return topicObj ? topicObj.color : '#1890ff';
  };

  const getTopicLabel = (topic) => {
    const topicObj = topics.find(t => t.key === topic);
    return topicObj ? topicObj.label : topic;
  };

  const fetchLeaderboard = async (topic) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter to show only current user's scores
        const userScores = data.filter(score => score.userName === user?.name || score.userEmail === user?.email);
        setLeaderboard(userScores);
        setUserPosition(null);
        setUserBestScore(userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : null);
      } else {
        message.error('Failed to fetch leaderboard');
        setLeaderboard([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      message.error('Failed to fetch leaderboard');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQuizHistory = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/quiz/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserQuizHistory(data.history || []);
      } else {
        console.error('Failed to fetch user quiz history:', response.status);
        setUserQuizHistory([]);
      }
    } catch (error) {
      console.error('Error fetching user quiz history:', error);
      setUserQuizHistory([]);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/quiz/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || []);
      } else {
        console.error('Failed to fetch stats:', response.status);
        setStats([]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats([]);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedTopic);
    fetchStats();
    fetchUserQuizHistory();
  }, [selectedTopic, user]);

  const getPositionIcon = (index) => {
    if (index === 0) return <CrownOutlined style={{ color: '#ffd700', fontSize: '18px' }} />;
    if (index === 1) return <StarOutlined style={{ color: '#c0c0c0', fontSize: '18px' }} />;
    if (index === 2) return <TrophyOutlined style={{ color: '#cd7f32', fontSize: '18px' }} />;
    return <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{index + 1}</span>;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#fa8c16';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUserBestScoreForTopic = (topic) => {
    const topicQuizzes = userQuizHistory.filter(quiz => quiz.topic === topic);
    if (topicQuizzes.length === 0) return null;
    return topicQuizzes.reduce((best, quiz) => quiz.score > best.score ? quiz : best);
  };

  const columns = [
    {
      title: 'Quiz',
      key: 'quizName',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: 200 }}>
          <div style={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'white'
          }}>
            {record.quizName || 'Unknown Quiz'}
          </div>
        </div>
      ),
    },
    {
      title: 'Score',
      key: 'score',
      render: (_, record) => (
        <Progress
          type="circle"
          size={40}
          percent={record.score || 0}
          strokeColor={getScoreColor(record.score || 0)}
          format={() => `${record.score || 0}%`}
        />
      ),
    },
    {
      title: 'Correct',
      key: 'correctAnswers',
      render: (_, record) => (
        <Text>{record.correctAnswers || 0}/{record.totalQuestions || 0}</Text>
      ),
    },
    {
      title: 'Time',
      key: 'timeSpent',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ClockCircleOutlined />
          <Text>{formatTime(record.timeSpent || 0)}</Text>
        </div>
      ),
    },
    {
      title: 'Date',
      key: 'createdAt',
      render: (_, record) => (
        <Text type="secondary">
          {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ 
      background: '#033f47', 
      minHeight: '100vh', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ color: '#c1ff72', marginBottom: '30px', textAlign: 'center' }}>
          <TrophyFilled style={{ marginRight: '12px' }} />
          Your Quiz History
        </Title>

        {/* User Stats */}
        {userBestScore && (
          <Card
            style={{
              marginBottom: '30px',
              background: 'linear-gradient(135deg, #c1ff72 0%, #a8e85c 100%)',
              border: 'none',
              borderRadius: '12px'
            }}
          >
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Statistic
                  title="Total Quizzes"
                  value={leaderboard.length}
                  valueStyle={{ color: '#033f47', fontSize: '32px' }}
                  prefix={<TrophyFilled />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Best Score"
                  value={userBestScore}
                  suffix="%"
                  valueStyle={{ color: '#033f47', fontSize: '32px' }}
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Average Score"
                  value={Math.round(leaderboard.reduce((sum, score) => sum + score.score, 0) / leaderboard.length)}
                  suffix="%"
                  valueStyle={{ color: '#033f47', fontSize: '32px' }}
                  prefix={<BarChartOutlined />}
                />
              </Col>
            </Row>
          </Card>
        )}


        {/* Take Quiz Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Button 
            type="primary" 
            size="large"
            style={{ 
              backgroundColor: '#c1ff72', 
              color: '#033f47', 
              border: 'none',
              borderRadius: '8px',
              height: '48px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onClick={() => navigate('/preparation')}
          >
            🚀 Take New Quiz
          </Button>
        </div>

        {/* User Quiz Status */}
        {user && (
          <Card
            style={{
              marginBottom: '30px',
              background: '#022e38',
              border: '1px solid #c1ff72',
              borderRadius: '12px'
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {userPosition && userBestScore ? (
                <>
                  <TrophyFilled style={{ fontSize: '48px', color: '#c1ff72', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#c1ff72', marginBottom: '8px' }}>
                    Your Performance in {getTopicLabel(selectedTopic)}
                  </Title>
                  <Text style={{ color: '#d7f5e7', marginBottom: '20px', display: 'block' }}>
                    Position: #{userPosition} | Best Score: {userBestScore?.score || 0}% | Time: {formatTime(userBestScore?.timeTaken || 0)}
                  </Text>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                      backgroundColor: '#c1ff72', 
                      color: '#033f47', 
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    onClick={() => navigate('/preparation')}
                  >
                    Take Another Quiz
                  </Button>
                </>
              ) : userQuizHistory.length > 0 ? (
                <>
                  <TrophyFilled style={{ fontSize: '48px', color: '#c1ff72', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#c1ff72', marginBottom: '8px' }}>
                    Your Quiz Progress
                  </Title>
                  <Text style={{ color: '#d7f5e7', marginBottom: '20px', display: 'block' }}>
                    You've taken {userQuizHistory.length} quiz{userQuizHistory.length > 1 ? 'zes' : ''} so far! 
                    {(() => {
                      const bestScoreForTopic = getUserBestScoreForTopic(selectedTopic);
                      if (bestScoreForTopic) {
                        return ` Best ${selectedTopic} score: ${bestScoreForTopic.score}%`;
                      }
                      return ` Last quiz: ${userQuizHistory[0]?.topic} - ${userQuizHistory[0]?.score}%`;
                    })()}
                  </Text>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                      backgroundColor: '#c1ff72', 
                      color: '#033f47', 
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    onClick={() => navigate('/preparation')}
                  >
                    Take Another Quiz
                  </Button>
                </>
              ) : (
                <>
                  <TrophyOutlined style={{ fontSize: '48px', color: '#c1ff72', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#c1ff72', marginBottom: '8px' }}>
                    Haven't taken any quizzes yet?
                  </Title>
                  <Text style={{ color: '#d7f5e7', marginBottom: '20px', display: 'block' }}>
                    Start your learning journey by taking quizzes in the Preparation section!
                  </Text>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                      backgroundColor: '#c1ff72', 
                      color: '#033f47', 
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    onClick={() => navigate('/preparation')}
                  >
                    Go to Preparation
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        <Row gutter={[24, 24]}>
          {/* Leaderboard Table */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChartOutlined />
                  <span style={{ color: '#c1ff72' }}>Top Performers - {getTopicLabel(selectedTopic)}</span>
                </div>
              }
              style={{
                background: '#022e38',
                border: '1px solid #044956',
                borderRadius: '12px'
              }}
              styles={{ body: { padding: 0 } }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px', color: '#c1ff72' }}>Loading leaderboard...</div>
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={leaderboard.map((item, index) => ({
                    ...item,
                    key: item._id || `${item.userName}-${item.completedAt}-${index}`
                  }))}
                  pagination={false}
                  rowKey="key"
                  style={{ background: 'transparent' }}
                  className="leaderboard-table leaderboard-item"
                />
              )}
            </Card>
          </Col>

          {/* Statistics */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Stats Summary */}
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChartOutlined />
                    <span style={{ color: '#c1ff72' }}>Statistics</span>
                  </div>
                }
                style={{
                  background: '#022e38',
                  border: '1px solid #044956',
                  borderRadius: '12px'
                }}
              >
                {statsLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                  </div>
                ) : (
                  <div>
                    {stats.length > 0 ? (
                      stats.map(stat => (
                        <div key={stat._id} style={{ marginBottom: '16px' }}>
                          <Text style={{ color: '#c1ff72', fontWeight: 'bold' }}>
                            {getTopicLabel(stat._id)}
                          </Text>
                          <div style={{ marginTop: '8px' }}>
                            <Text style={{ color: '#d7f5e7' }}>
                              Total Attempts: {stat.totalAttempts || 0}
                            </Text>
                            <br />
                            <Text style={{ color: '#d7f5e7' }}>
                              Average Score: {Math.round(stat.averageScore || 0)}%
                            </Text>
                            <br />
                            <Text style={{ color: '#d7f5e7' }}>
                              Highest Score: {stat.highestScore || 0}%
                            </Text>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Text style={{ color: '#d7f5e7' }}>No statistics available</Text>
                    )}
                  </div>
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .leaderboard-table .ant-table-thead > tr > th {
          background: #033f47 !important;
          color: #c1ff72 !important;
          border-bottom: 1px solid #044956 !important;
        }
        
        .leaderboard-table .ant-table-tbody > tr > td {
            background: #044956  !important;
          color: white !important;
          border-bottom: 1px solid #044956 !important;
        }
        
        .leaderboard-table .ant-table-tbody > tr:hover > td {
          background: #033f47 !important;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard; 