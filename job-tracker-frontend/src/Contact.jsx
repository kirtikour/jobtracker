import React, { useState } from 'react';
import { Layout, Typography, Card, Form, Input, Button, Row, Col, message, Space } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <MailOutlined style={{ fontSize: 24, color: '#c1ff72' }} />,
      title: 'Email',
      value: 'support@hirix.com',
      description: 'Get in touch with our support team'
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 24, color: '#c1ff72' }} />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Call us during business hours'
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: 24, color: '#c1ff72' }} />,
      title: 'Address',
      value: '123 Tech Street, Silicon Valley, CA 94025',
      description: 'Visit our headquarters'
    }
  ];

  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you an email with instructions.'
    },
    {
      question: 'How does job recommendation work?',
      answer: 'Our AI analyzes your profile, skills, and preferences to match you with relevant job opportunities from our database.'
    },
    {
      question: 'Can I export my job applications?',
      answer: 'Yes! You can export your job applications as a CSV file from the Analytics dashboard for your records.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal information.'
    }
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('Thank you for your message! We\'ll get back to you within 24 hours.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              Get in Touch
            </Title>
            <Paragraph style={{ 
              color: '#d7f5e7', 
              fontSize: 18, 
              maxWidth: 600, 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Have questions, feedback, or need support? We're here to help you succeed in your job search journey.
            </Paragraph>
          </div>

          <Row gutter={[40, 40]}>
            {/* Contact Form */}
            <Col xs={24} lg={14}>
              <Card style={{ 
                backgroundColor: '#022e38', 
                border: '1px solid #044956',
                borderRadius: 16
              }}>
                <Title level={2} style={{ color: '#c1ff72', marginBottom: 30 }}>
                  Send us a Message
                </Title>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  requiredMark={false}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label={<Text style={{ color: '#d7f5e7' }}>First Name</Text>}
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input 
                          prefix={<UserOutlined style={{ color: '#a0a0a0' }} />}
                          placeholder="Enter your first name"
                          style={{
                            backgroundColor: '#044956',
                            border: '1px solid #066a7a',
                            color: '#d7f5e7',
                            borderRadius: 8
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label={<Text style={{ color: '#d7f5e7' }}>Last Name</Text>}
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input 
                          prefix={<UserOutlined style={{ color: '#a0a0a0' }} />}
                          placeholder="Enter your last name"
                          style={{
                            backgroundColor: '#044956',
                            border: '1px solid #066a7a',
                            color: '#d7f5e7',
                            borderRadius: 8
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="email"
                    label={<Text style={{ color: '#d7f5e7' }}>Email</Text>}
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: '#a0a0a0' }} />}
                      placeholder="Enter your email address"
                      style={{
                        backgroundColor: '#044956',
                        border: '1px solid #066a7a',
                        color: '#d7f5e7',
                        borderRadius: 8
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label={<Text style={{ color: '#d7f5e7' }}>Subject</Text>}
                    rules={[{ required: true, message: 'Please enter a subject' }]}
                  >
                    <Input 
                      placeholder="What's this about?"
                      style={{
                        backgroundColor: '#044956',
                        border: '1px solid #066a7a',
                        color: '#d7f5e7',
                        borderRadius: 8
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={<Text style={{ color: '#d7f5e7' }}>Message</Text>}
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea 
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      style={{
                        backgroundColor: '#044956',
                        border: '1px solid #066a7a',
                        color: '#d7f5e7',
                        borderRadius: 8,
                        resize: 'none'
                      }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SendOutlined />}
                      size="large"
                      style={{
                        backgroundColor: '#c1ff72',
                        borderColor: '#c1ff72',
                        color: '#033f47',
                        height: 48,
                        width: '100%',
                        fontSize: 16,
                        fontWeight: 'bold',
                        borderRadius: 8
                      }}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Contact Info */}
            <Col xs={24} lg={10}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                
                {/* Contact Information */}
                <Card style={{ 
                  backgroundColor: '#022e38', 
                  border: '1px solid #044956',
                  borderRadius: 16
                }}>
                  <Title level={3} style={{ color: '#c1ff72', marginBottom: 24 }}>
                    Contact Information
                  </Title>
                  
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {contactInfo.map((info, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: '50%', 
                          backgroundColor: '#044956',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #066a7a'
                        }}>
                          {info.icon}
                        </div>
                        <div>
                          <Text style={{ 
                            color: '#d7f5e7', 
                            fontSize: 16, 
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: 4
                          }}>
                            {info.title}
                          </Text>
                          <Text style={{ 
                            color: '#c1ff72', 
                            fontSize: 14,
                            display: 'block',
                            marginBottom: 4
                          }}>
                            {info.value}
                          </Text>
                          <Text style={{ color: '#a0a0a0', fontSize: 12 }}>
                            {info.description}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </Space>
                </Card>

                {/* FAQ Section */}
                <Card style={{ 
                  backgroundColor: '#022e38', 
                  border: '1px solid #044956',
                  borderRadius: 16
                }}>
                  <Title level={3} style={{ color: '#c1ff72', marginBottom: 24 }}>
                    Frequently Asked Questions
                  </Title>
                  
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {faqItems.map((item, index) => (
                      <div key={index}>
                        <Text style={{ 
                          color: '#d7f5e7', 
                          fontSize: 14, 
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: 8
                        }}>
                          {item.question}
                        </Text>
                        <Text style={{ color: '#a0a0a0', fontSize: 13, lineHeight: 1.5 }}>
                          {item.answer}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>

                {/* Response Time */}
                <Card style={{ 
                  backgroundColor: 'linear-gradient(135deg, #044956 0%, #066a7a 100%)',
                  border: '1px solid #0889a3',
                  borderRadius: 16,
                  textAlign: 'center'
                }}>
                  <MessageOutlined style={{ fontSize: 32, color: '#c1ff72', marginBottom: 16 }} />
                  <Title level={4} style={{ color: '#d7f5e7', marginBottom: 8 }}>
                    Quick Response
                  </Title>
                  <Paragraph style={{ color: '#a0a0a0', margin: 0 }}>
                    We typically respond within 24 hours during business days.
                  </Paragraph>
                </Card>

              </Space>
            </Col>
          </Row>

          {/* Business Hours */}
          <Card style={{ 
            backgroundColor: '#022e38', 
            border: '1px solid #044956',
            borderRadius: 16,
            marginTop: 40
          }}>
            <Title level={3} style={{ color: '#c1ff72', textAlign: 'center', marginBottom: 24 }}>
              Business Hours
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#c1ff72', fontSize: 16, fontWeight: 'bold' }}>
                    Monday - Friday
                  </Text>
                  <br />
                  <Text style={{ color: '#d7f5e7' }}>
                    9:00 AM - 6:00 PM PST
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#c1ff72', fontSize: 16, fontWeight: 'bold' }}>
                    Saturday
                  </Text>
                  <br />
                  <Text style={{ color: '#d7f5e7' }}>
                    10:00 AM - 4:00 PM PST
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#c1ff72', fontSize: 16, fontWeight: 'bold' }}>
                    Sunday
                  </Text>
                  <br />
                  <Text style={{ color: '#d7f5e7' }}>
                    Closed
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

        </div>
      </Content>
    </Layout>
  );
};

export default Contact; 