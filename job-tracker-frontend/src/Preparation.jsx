// Preparation.jsx
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Typography,
  Space,
  List,
  Tag,
  Radio,
  message,
  Row,
  Col,
  Statistic,
  Divider,
  Tabs,
  Spin,
  Empty,
  Modal
} from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  AimOutlined,
  BulbOutlined,
  ArrowLeftOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;
import { useTheme } from './ThemeContext';

const Preparation = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestionCountModal, setShowQuestionCountModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Get job info from URL params or location state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobId = params.get('jobId');
    const jobTitle = params.get('jobTitle');
    const company = params.get('company');

    if (jobId && jobTitle && company) {
      setSelectedJob({ id: jobId, title: jobTitle, company });
    }
  }, [location]);

  // Fetch topics from API (supports custom URL via Vite env)
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const customTopicsUrl = import.meta.env.VITE_QUIZ_TOPICS_URL;
      // Prefer custom topics API if provided (e.g., Gist raw JSON)
      if (customTopicsUrl) {
        const resp = await fetch(customTopicsUrl);
        if (resp.ok) {
          const json = await resp.json();
          const source = Array.isArray(json) ? json : (json.topics || json.data || []);
          if (Array.isArray(source) && source.length) {
            const mapped = source.map((t, index) => ({
              id: (t.id ?? t.categoryId ?? t.slug ?? `${index + 1}`).toString(),
              title: t.title ?? t.name ?? `Topic ${index + 1}`,
              description: t.description ?? `Test your knowledge in ${(t.title ?? t.name ?? 'this topic').toLowerCase()}`,
              icon: t.icon ?? '📚',
              difficulty: t.difficulty ?? ['Beginner', 'Intermediate', 'Advanced'][index % 3],
              questionCounts: t.questionCounts ?? { 5: 5, 10: 10, 15: 15 }
            }));
            setTopics(mapped);
            return;
          }
        }
      }

      // Fallback to OpenTrivia categories
      const response = await fetch('https://opentdb.com/api_category.php');

      if (response.ok) {
        const data = await response.json();

        // Map API categories to our format
        const mappedTopics = data.trivia_categories.slice(0, 6).map((category, index) => {
          const icons = ['⚡', '⚛️', '🟢', '🎨', '🗄️', '🧮'];
          const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

          return {
            id: category.id.toString(),
            title: category.name,
            description: `Test your knowledge in ${category.name.toLowerCase()}`,
            icon: icons[index] || '📚',
            difficulty: difficulties[index % 3],
            questionCounts: { 5: 5, 10: 10, 15: 15 }
          };
        });

        setTopics(mappedTopics);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.error('Error fetching topics from API, using fallback:', error);

      // Fallback to mock data
      const mockTopics = [
        {
          id: 'javascript-basics',
          title: 'JavaScript Fundamentals',
          description: 'Core JavaScript concepts and modern ES6+ features',
          icon: '⚡',
          difficulty: 'Beginner',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'react-basics',
          title: 'React Fundamentals',
          description: 'Core React concepts, hooks, and best practices',
          icon: '⚛️',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'business',
          title: 'Business & Management',
          description: 'Business concepts, marketing, and management principles',
          icon: '💼',
          difficulty: 'Beginner',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'computer-science',
          title: 'Computer Science',
          description: 'Data structures, algorithms, and CS fundamentals',
          icon: '🧮',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'data-science',
          title: 'Data Science & ML',
          description: 'Machine learning, statistics, and data analysis',
          icon: '📊',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'design',
          title: 'UI/UX Design',
          description: 'Design principles, wireframing, and user experience',
          icon: '🎨',
          difficulty: 'Beginner',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'python',
          title: 'Python Programming',
          description: 'Python basics, data structures, and automation',
          icon: '🐍',
          difficulty: 'Beginner',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'devops',
          title: 'DevOps & Cloud',
          description: 'Docker, Kubernetes, AWS, and CI/CD practices',
          icon: '☁️',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'mobile',
          title: 'Mobile Development',
          description: 'React Native, Flutter, and mobile app concepts',
          icon: '📱',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'cybersecurity',
          title: 'Cybersecurity',
          description: 'Security principles, ethical hacking, and best practices',
          icon: '🔒',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'product-management',
          title: 'Product Management',
          description: 'Product strategy, user research, and agile methodologies',
          icon: '📈',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'nodejs',
          title: 'Node.js & Backend',
          description: 'Server-side JavaScript, Express, and API development',
          icon: '🟢',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'database',
          title: 'Database Design',
          description: 'SQL, NoSQL, database modeling and optimization',
          icon: '🗄️',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'testing',
          title: 'Software Testing',
          description: 'Unit testing, integration testing, and QA practices',
          icon: '🧪',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'git',
          title: 'Git & Version Control',
          description: 'Git workflows, branching strategies, and collaboration',
          icon: '📝',
          difficulty: 'Beginner',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'system-design',
          title: 'System Design',
          description: 'Scalable architecture, microservices, and design patterns',
          icon: '🏗️',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'ai-ml',
          title: 'AI & Machine Learning',
          description: 'Neural networks, deep learning, and AI applications',
          icon: '🤖',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'blockchain',
          title: 'Blockchain & Web3',
          description: 'Cryptocurrency, smart contracts, and decentralized apps',
          icon: '⛓️',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'game-dev',
          title: 'Game Development',
          description: 'Game engines, graphics programming, and game design',
          icon: '🎮',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'finance',
          title: 'Finance & Economics',
          description: 'Financial markets, investment strategies, and economics',
          icon: '💰',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'healthcare',
          title: 'Healthcare Tech',
          description: 'Medical software, health informatics, and bioinformatics',
          icon: '🏥',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'education',
          title: 'EdTech & Learning',
          description: 'Educational technology, LMS, and digital learning platforms',
          icon: '📚',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'ecommerce',
          title: 'E-commerce & Retail',
          description: 'Online shopping platforms, payment systems, and retail tech',
          icon: '🛒',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'social-media',
          title: 'Social Media & Marketing',
          description: 'Digital marketing, social platforms, and content strategy',
          icon: '📱',
          difficulty: 'Beginner',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'legal-tech',
          title: 'Legal Technology',
          description: 'Legal software, contract automation, and legal AI',
          icon: '⚖️',
          difficulty: 'Advanced',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'real-estate',
          title: 'Real Estate Tech',
          description: 'Property management, real estate platforms, and PropTech',
          icon: '🏠',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        },
        {
          id: 'logistics',
          title: 'Logistics & Supply Chain',
          description: 'Supply chain management, logistics optimization, and tracking',
          icon: '🚚',
          difficulty: 'Intermediate',
          questionCounts: { 5: 5, 10: 10, 15: 15 }
        }
      ];

      setTopics(mockTopics);
    } finally {
      setLoading(false);
    }
  };

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz functionality
  const handleStartQuiz = (topic) => {
    setSelectedTopic(topic);
    setShowQuestionCountModal(true);
  };

  const startQuiz = async (questionCount) => {
    setQuestionsLoading(true);
    setShowQuestionCountModal(false);

    try {
      const fetchedQuestions = await getMockQuestions(questionCount, selectedTopic.id);
      setQuestions(fetchedQuestions);
      setCurrentQuiz({ ...selectedTopic, questionCount });
      setQuizAnswers({});
      setQuizResults(null);
      setCurrentQuestionIndex(0);
      setSelectedTopic(null);
      startTimer();
    } catch (error) {
      console.error('Error loading questions:', error);
      message.error('Failed to load questions. Please try again.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const submitQuiz = async () => {
    const totalQuestions = currentQuiz.questionCount;
    let correctAnswers = 0;

    // Accurate scoring based on selected option vs correct answer
    for (let i = 0; i < totalQuestions; i++) {
      const chosenIndex = quizAnswers[i];
      if (typeof chosenIndex === 'number' && questions[i]) {
        const isCorrect = questions[i].options && questions[i].correctAnswer
          ? questions[i].options[chosenIndex] === questions[i].correctAnswer
          : chosenIndex === (questions[i].correctIndex ?? -1);
        if (isCorrect) correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = timer;

    setQuizResults({
      score,
      correctAnswers,
      totalQuestions,
      timeSpent
    });

    stopTimer();

    // Auto-save to leaderboard
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/quiz/save-result', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quizName: `${currentQuiz.title} (${currentQuiz.questionCount} questions)`,
            score,
            timeSpent,
            userName: user.name || user.email,
            jobTitle: selectedJob?.title || 'General Practice'
          })
        });

        if (response.ok) {
          message.success('Quiz results saved to leaderboard!');
        }
      } catch (error) {
        console.error('Error saving quiz results:', error);
        message.error('Failed to save results');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#73d13d';
    if (score >= 70) return '#faad14';
    if (score >= 60) return '#ff7a45';
    return '#ff4d4f';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! You\'re well prepared!';
    if (score >= 80) return 'Great job! You\'re ready for the interview!';
    if (score >= 70) return 'Good work! Keep practicing to improve.';
    if (score >= 60) return 'Not bad, but you need more practice.';
    return 'Keep studying and try again!';
  };

  // Fetch questions from API (supports custom URL via Vite env)
  const getMockQuestions = async (count, categoryId) => {
    try {
      const customQuestionsUrl = import.meta.env.VITE_QUIZ_QUESTIONS_URL;

      if (customQuestionsUrl) {
        // Replace placeholders if present
        let url = customQuestionsUrl
          .replace('{count}', encodeURIComponent(count))
          .replace('{categoryId}', encodeURIComponent(categoryId));
        // If no placeholders, append common params as query string
        if (url === customQuestionsUrl) {
          const hasQuery = url.includes('?');
          url = `${url}${hasQuery ? '&' : '?'}amount=${encodeURIComponent(count)}&category=${encodeURIComponent(categoryId)}`;
        }
        const resp = await fetch(url);
        if (resp.ok) {
          const data = await resp.json();
          // Support various shapes: array, {questions:[]}, OpenTrivia {results:[]}
          const raw = Array.isArray(data) ? data : (data.questions || data.results || data.items || []);
          if (Array.isArray(raw) && raw.length) {
            const mapped = raw.slice(0, count).map((q) => {
              const options = q.options ?? (q.incorrect_answers ? [...q.incorrect_answers, q.correct_answer] : []);
              const shuffled = options.length ? options.sort(() => Math.random() - 0.5) : [];
              const correctAnswer = q.correctAnswer ?? q.correct ?? q.correct_answer ?? '';
              const correctIndex = shuffled.findIndex((o) => o === correctAnswer);
              return {
                question: q.question ?? q.title ?? 'Untitled question',
                options: shuffled,
                correctAnswer,
                correctIndex: correctIndex >= 0 ? correctIndex : undefined
              };
            });
            if (mapped.length) return mapped;
          }
        }
      }

      // Fallback to OpenTrivia
      const response = await fetch(`https://opentdb.com/api.php?amount=${count}&category=${categoryId}&type=multiple`);

      if (response.ok) {
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          return data.results.map(q => {
            const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
            const correctIndex = options.findIndex(o => o === q.correct_answer);
            return {
              question: q.question,
              options,
              correctAnswer: q.correct_answer,
              correctIndex
            };
          });
        }
      }
    } catch (error) {
      console.error('Error fetching questions from API:', error);
    }

    // Fallback to mock questions
    const questions = [
      // JavaScript/Programming Questions
      {
        question: 'What is the difference between let, const, and var?',
        options: [
          'let and const are block-scoped, var is function-scoped',
          'They are all the same',
          'const is mutable, let and var are immutable',
          'var is the newest, let and const are deprecated'
        ],
        correctAnswer: 'let and const are block-scoped, var is function-scoped'
      },
      {
        question: 'What does "this" refer to in JavaScript?',
        options: [
          'Always refers to the global object',
          'Refers to the object that owns the current code',
          'Always refers to the function',
          'Refers to the previous object'
        ],
        correctAnswer: 'Refers to the object that owns the current code'
      },
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A way to close browser tabs',
          'A function that has access to variables in its outer scope',
          'A method to close database connections',
          'A type of loop'
        ],
        correctAnswer: 'A function that has access to variables in its outer scope'
      },
      {
        question: 'What is the purpose of async/await?',
        options: [
          'To make code run faster',
          'To handle asynchronous operations more elegantly',
          'To create new variables',
          'To import modules'
        ],
        correctAnswer: 'To handle asynchronous operations more elegantly'
      },
      {
        question: 'What is the difference between == and ===?',
        options: [
          '== checks value and type, === checks only value',
          '== checks only value, === checks value and type',
          'They are identical',
          '== is newer syntax'
        ],
        correctAnswer: '== checks only value, === checks value and type'
      },
      // Business Questions
      {
        question: 'What is SWOT analysis used for?',
        options: [
          'Analyzing website performance',
          'Evaluating strengths, weaknesses, opportunities, and threats',
          'Calculating financial ratios',
          'Measuring customer satisfaction'
        ],
        correctAnswer: 'Evaluating strengths, weaknesses, opportunities, and threats'
      },
      {
        question: 'What is the primary goal of marketing?',
        options: [
          'To maximize profits',
          'To create value for customers',
          'To reduce costs',
          'To increase market share'
        ],
        correctAnswer: 'To create value for customers'
      },
      {
        question: 'What does ROI stand for?',
        options: [
          'Return on Investment',
          'Rate of Interest',
          'Return on Income',
          'Rate of Inflation'
        ],
        correctAnswer: 'Return on Investment'
      },
      // Computer Science Questions
      {
        question: 'What is the time complexity of binary search?',
        options: [
          'O(n)',
          'O(log n)',
          'O(n²)',
          'O(1)'
        ],
        correctAnswer: 'O(log n)'
      },
      {
        question: 'What is a stack data structure?',
        options: [
          'A linear data structure with LIFO principle',
          'A tree-based data structure',
          'A graph data structure',
          'A hash table'
        ],
        correctAnswer: 'A linear data structure with LIFO principle'
      },
      {
        question: 'What is the purpose of a database index?',
        options: [
          'To store more data',
          'To improve query performance',
          'To reduce storage space',
          'To encrypt data'
        ],
        correctAnswer: 'To improve query performance'
      },
      // Data Science Questions
      {
        question: 'What is overfitting in machine learning?',
        options: [
          'When a model performs too well on training data',
          'When a model is too simple',
          'When data is missing',
          'When features are correlated'
        ],
        correctAnswer: 'When a model performs too well on training data'
      },
      {
        question: 'What is the difference between supervised and unsupervised learning?',
        options: [
          'Supervised uses labeled data, unsupervised uses unlabeled data',
          'Supervised is faster than unsupervised',
          'Unsupervised is more accurate',
          'They are the same thing'
        ],
        correctAnswer: 'Supervised uses labeled data, unsupervised uses unlabeled data'
      },
      // Design Questions
      {
        question: 'What is the golden ratio in design?',
        options: [
          '1:1.618',
          '1:2',
          '1:1',
          '2:1'
        ],
        correctAnswer: '1:1.618'
      },
      {
        question: 'What is the purpose of wireframing?',
        options: [
          'To create final designs',
          'To plan layout and structure',
          'To add colors',
          'To write content'
        ],
        correctAnswer: 'To plan layout and structure'
      },
      // Project Management Questions
      {
        question: 'What is a Gantt chart used for?',
        options: [
          'Tracking project timelines',
          'Creating budgets',
          'Managing team communication',
          'Analyzing risks'
        ],
        correctAnswer: 'Tracking project timelines'
      },
      {
        question: 'What is the critical path in project management?',
        options: [
          'The longest sequence of tasks',
          'The shortest sequence of tasks',
          'The most expensive tasks',
          'The easiest tasks'
        ],
        correctAnswer: 'The longest sequence of tasks'
      }
    ];

    // Attach correctIndex for fallback questions
    const withIndexes = questions.map((q) => ({
      ...q,
      correctIndex: q.options.findIndex((o) => o === q.correctAnswer)
    }));
    return withIndexes.slice(0, count);
  };

  // If we're in quiz mode, show quiz page
  if (currentQuiz && !quizResults) {
    if (questionsLoading) {
      return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <Content style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" style={{ color: theme.colors.accent }} />
              <div style={{ marginTop: 16, color: theme.colors.textPrimary, fontSize: 18 }}>
                Loading questions...
              </div>
            </div>
          </Content>
        </Layout>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Content style={{ padding: '20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Quiz Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 32,
              padding: '20px',
              backgroundColor: theme.colors.secondaryBg,
              borderRadius: 12,
              border: `1px solid ${theme.colors.border}`
            }}>
              <div>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setCurrentQuiz(null)}
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                    marginBottom: 8
                  }}
                >
                  Back to Topics
                </Button>
                <Title level={3} style={{ color: theme.colors.accent, margin: 0 }}>
                  {currentQuiz.icon} {currentQuiz.title}
                </Title>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '2rem',
                  color: theme.colors.accent,
                  fontWeight: 'bold',
                  marginBottom: 4
                }}>
                  {formatTime(timer)}
                </div>
                <Text style={{ color: theme.colors.textSecondary }}>
                  Question {currentQuestionIndex + 1} of {currentQuiz.questionCount}
                </Text>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                width: '100%',
                height: 8,
                backgroundColor: theme.colors.cardBg,
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((currentQuestionIndex + 1) / currentQuiz.questionCount) * 100}%`,
                  height: '100%',
                  backgroundColor: theme.colors.accent,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Current Question */}
            <Card style={{
              backgroundColor: theme.colors.secondaryBg,
              border: `1px solid ${theme.colors.border}`,
              marginBottom: 24
            }}>
              <Title level={4} style={{ color: theme.colors.accent, marginBottom: 24 }}>
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </Title>

              <Radio.Group
                value={quizAnswers[currentQuestionIndex]}
                onChange={(e) => {
                  console.log('Selected answer:', e.target.value, 'for question:', currentQuestionIndex);
                  setQuizAnswers(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }));
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {currentQuestion.options.map((option, optIndex) => (
                    <Radio
                      key={optIndex}
                      value={optIndex}
                      style={{
                        color: theme.colors.textPrimary,
                        padding: '16px 20px',
                        backgroundColor: theme.colors.cardBg,
                        borderRadius: 8,
                        border: `1px solid ${theme.colors.border}`,
                        width: '100%',
                        marginBottom: 12,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {option}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                style={{
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary
                }}
              >
                Previous
              </Button>

              {currentQuestionIndex < currentQuiz.questionCount - 1 ? (
                <Button
                  type="primary"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={quizAnswers[currentQuestionIndex] === undefined}
                  style={{
                    backgroundColor: theme.colors.accent,
                    borderColor: theme.colors.accent,
                    color: theme.colors.primaryBg
                  }}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < currentQuiz.questionCount}
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    color: '#ffffff'
                  }}
                  icon={<CheckCircleOutlined />}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  // If quiz is completed, show results
  if (quizResults) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Content style={{ padding: '20px' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <Card style={{
              backgroundColor: theme.colors.secondaryBg,
              border: `1px solid ${theme.colors.border}`,
              padding: '40px'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: 16,
                color: getScoreColor(quizResults.score)
              }}>
                {quizResults.score >= 90 ? '🏆' : quizResults.score >= 80 ? '🎉' : quizResults.score >= 70 ? '👍' : '📚'}
              </div>

              <Title level={2} style={{ color: theme.colors.accent, marginBottom: 16 }}>
                Quiz Complete!
              </Title>

              <Statistic
                title={<span style={{ color: theme.colors.textPrimary }}>Your Score</span>}
                value={quizResults.score}
                suffix="%"
                valueStyle={{
                  color: getScoreColor(quizResults.score),
                  fontSize: '3rem'
                }}
              />

              <Text style={{ color: theme.colors.textPrimary, display: 'block', marginTop: 16, fontSize: 16 }}>
                {quizResults.correctAnswers} out of {quizResults.totalQuestions} correct
              </Text>

              <Text style={{ color: theme.colors.textSecondary, display: 'block', marginTop: 8 }}>
                ⏱️ Time taken: {formatTime(quizResults.timeSpent)}
              </Text>

              <div style={{
                marginTop: 24,
                padding: '16px',
                backgroundColor: theme.colors.cardBg,
                borderRadius: 8,
                border: `1px solid ${theme.colors.border}`
              }}>
                <Text style={{ color: getScoreColor(quizResults.score), fontWeight: 'bold', fontSize: 16 }}>
                  {getScoreMessage(quizResults.score)}
                </Text>
              </div>

              <Space style={{ marginTop: 32 }}>
                <Button
                  onClick={() => {
                    setQuizResults(null);
                    setCurrentQuiz(null);
                    setActiveTab('topics');
                  }}
                  style={{
                    backgroundColor: theme.colors.accent,
                    borderColor: theme.colors.accent,
                    color: theme.colors.primaryBg,
                    height: 40,
                    padding: '0 24px'
                  }}
                >
                  Try Another Quiz
                </Button>
                <Button
                  onClick={() => {
                    setQuizResults(null);
                    setCurrentQuiz(null);
                    navigate('/dashboard');
                  }}
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                    height: 40,
                    padding: '0 24px'
                  }}
                >
                  Back to Dashboard
                </Button>
              </Space>
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  // Main preparation page
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar />
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={1} style={{ color: theme.colors.accent, marginBottom: 8 }}>
              🎯 Interview Preparation
            </Title>
            {selectedJob && (
              <div style={{
                backgroundColor: theme.colors.secondaryBg,
                padding: '16px 24px',
                borderRadius: 12,
                border: `1px solid ${theme.colors.border}`,
                display: 'inline-block'
              }}>
                <Text style={{ color: theme.colors.textPrimary, fontSize: 16 }}>
                  Preparing for: <strong style={{ color: theme.colors.accent }}>{selectedJob.title}</strong> at <strong style={{ color: theme.colors.accent }}>{selectedJob.company}</strong>
                </Text>
              </div>
            )}
          </div>

          {/* Main Content Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ backgroundColor: theme.colors.secondaryBg, borderRadius: 12, padding: '20px' }}
            tabBarStyle={{ color: theme.colors.textPrimary }}
          >
            <TabPane tab={<span style={{ color: theme.colors.accent }}>📊 Overview</span>} key="overview">
              <Row gutter={[24, 24]}>
                {/* Quick Stats */}
                <Col xs={24} md={8}>
                  <Card style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: theme.colors.textPrimary }}>Available Topics</span>}
                      value={topics.length}
                      valueStyle={{ color: theme.colors.accent }}
                      prefix={<BookOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: theme.colors.textPrimary }}>Quiz Lengths</span>}
                      value="3"
                      valueStyle={{ color: '#faad14' }}
                      prefix={<BulbOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: theme.colors.textPrimary }}>Timer Ready</span>}
                      value={formatTime(timer)}
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Quick Start */}
              <Card
                title={<span style={{ color: theme.colors.accent }}>🚀 Quick Start</span>}
                style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, marginTop: 24 }}
              >
                <Text style={{ color: theme.colors.textPrimary, display: 'block', marginBottom: 16 }}>
                  Choose a topic and quiz length to start practicing. The timer will automatically start when you begin a quiz.
                </Text>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setActiveTab('topics')}
                  style={{
                    backgroundColor: theme.colors.accent,
                    borderColor: theme.colors.accent,
                    color: theme.colors.primaryBg,
                    height: 48,
                    padding: '0 32px'
                  }}
                  icon={<RocketOutlined />}
                >
                  Start Practicing
                </Button>
              </Card>
            </TabPane>

            <TabPane tab={<span style={{ color: theme.colors.accent }}>📝 Practice Topics</span>} key="topics">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" />
                  <Text style={{ color: theme.colors.textPrimary, display: 'block', marginTop: 16 }}>
                    Loading topics...
                  </Text>
                </div>
              ) : topics.length === 0 ? (
                <Empty
                  description="No topics available"
                  style={{ color: theme.colors.textSecondary }}
                />
              ) : (
                <Row gutter={[24, 24]}>
                  {topics.map((topic) => (
                    <Col xs={24} md={8} key={topic.id}>
                      <Card
                        style={{
                          backgroundColor: theme.colors.cardBg,
                          border: `1px solid ${theme.colors.border}`,
                          height: '100%',
                          transition: 'all 0.3s ease'
                        }}
                        hoverable
                      >
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                          <div style={{ fontSize: '3rem', marginBottom: 12 }}>
                            {topic.icon}
                          </div>
                          <Title level={4} style={{ color: theme.colors.accent, marginBottom: 8 }}>
                            {topic.title}
                          </Title>
                          <Text style={{ color: theme.colors.textSecondary, fontSize: 14, display: 'block', marginBottom: 8 }}>
                            {topic.description}
                          </Text>
                          <Tag color={topic.difficulty === 'Beginner' ? 'green' : topic.difficulty === 'Intermediate' ? 'orange' : 'red'}>
                            {topic.difficulty}
                          </Tag>
                        </div>

                        <Divider style={{ borderColor: theme.colors.border }} />

                        <div style={{ textAlign: 'center' }}>
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => handleStartQuiz(topic)}
                            style={{
                              backgroundColor: theme.colors.accent,
                              borderColor: theme.colors.accent,
                              color: theme.colors.primaryBg,
                              width: '100%',
                              height: 48,
                              fontSize: 16,
                              fontWeight: 'bold'
                            }}
                            icon={<RocketOutlined />}
                          >
                            Start Quiz
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </TabPane>
          </Tabs>
        </div>
      </Content>

      {/* Question Count Selection Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>{selectedTopic?.icon}</span>
            <span style={{ color: theme.colors.accent }}>Select Quiz Length</span>
          </div>
        }
        open={showQuestionCountModal}
        onCancel={() => {
          setShowQuestionCountModal(false);
          setSelectedTopic(null);
        }}
        footer={null}
        width={500}
        styles={{
          content: { backgroundColor: theme.colors.secondaryBg },
          body: { backgroundColor: theme.colors.secondaryBg, color: theme.colors.textPrimary }
        }}
      >
        {selectedTopic && (
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ color: theme.colors.accent, marginBottom: 16 }}>
              {selectedTopic.title}
            </Title>
            <Text style={{ color: theme.colors.textSecondary, display: 'block', marginBottom: 24 }}>
              {selectedTopic.description}
            </Text>

            <div style={{
              backgroundColor: theme.colors.cardBg,
              padding: '20px',
              borderRadius: 12,
              border: `1px solid ${theme.colors.border}`
            }}>
              <Text style={{ color: theme.colors.textPrimary, display: 'block', marginBottom: 16, fontSize: 16 }}>
                Choose the number of questions for your quiz:
              </Text>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => startQuiz(5)}
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    width: '100%',
                    height: 50,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                  icon={<RocketOutlined />}
                >
                  Quick Quiz (5 questions) - ~5 minutes
                </Button>

                <Button
                  type="primary"
                  size="large"
                  onClick={() => startQuiz(10)}
                  style={{
                    backgroundColor: '#faad14',
                    borderColor: '#faad14',
                    width: '100%',
                    height: 50,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                  icon={<RocketOutlined />}
                >
                  Standard Quiz (10 questions) - ~10 minutes
                </Button>

                <Button
                  type="primary"
                  size="large"
                  onClick={() => startQuiz(15)}
                  style={{
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    width: '100%',
                    height: 50,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                  icon={<RocketOutlined />}
                >
                  Comprehensive Quiz (15 questions) - ~15 minutes
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Preparation;
