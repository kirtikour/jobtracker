import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  message, 
  Card, 
  Select, 
  Upload, 
  Space,
  Divider,
  Row,
  Col,
  Tag,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PostJobForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    setLoading(true);
    message.loading('Posting your job...', 0);
    
    try {
      // Here you would typically send the data to your backend
      const jobData = {
        ...values,
        tags: tags,
        postedDate: new Date().toISOString(),
        companyLogo: fileList.length > 0 ? fileList[0].url : null,
        status: 'active'
      };

      console.log('Job data to be posted:', jobData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('✅ Job posted successfully!');
      message.success('🎉 Your job listing is now live and visible to candidates.');
      
      // Reset form
      form.resetFields();
      setTags([]);
      setFileList([]);
      
      // Navigate back to jobs page
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
      
    } catch (error) {
      message.error('❌ Failed to post job. Please try again.');
      console.error('Error posting job:', error);
    } finally {
      message.destroy();
      setLoading(false);
    }
  };

  const handleTagClose = (removedTag) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadButton = (
    <div style={{ color: '#c1ff72' }}>
      <UploadOutlined />
      <div style={{ marginTop: 8, color: '#d7f5e7' }}>Upload Logo</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#033f47' }}>
      <Navbar />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <Card
          style={{
            backgroundColor: '#022e38',
            border: '1px solid #044956',
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            marginBottom: 24
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/jobs')}
              style={{ 
                marginBottom: 16,
                backgroundColor: '#044956',
                borderColor: '#044956',
                color: '#d7f5e7'
              }}
            >
              Back to Jobs
            </Button>
            <Title level={2} style={{ margin: 0, color: '#c1ff72' }}>
              🚀 Post a New Job
            </Title>
            <Text style={{ color: '#a0a0a0' }}>
              Fill out the form below to create a new job listing. All fields marked with * are required.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="title"
                  label={<span style={{ color: '#c1ff72' }}>Job Title *</span>}
                  rules={[{ required: true, message: 'Please enter the job title!' }]}
                >
                  <Input 
                    placeholder="e.g., Senior React Developer"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} lg={12}>
                <Form.Item
                  name="company"
                  label={<span style={{ color: '#c1ff72' }}>Company Name *</span>}
                  rules={[{ required: true, message: 'Please enter the company name!' }]}
                >
                  <Input 
                    placeholder="e.g., TechCorp Inc."
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="location"
                  label={<span style={{ color: '#c1ff72' }}>Location *</span>}
                  rules={[{ required: true, message: 'Please enter the job location!' }]}
                >
                  <Input 
                    placeholder="e.g., New York, NY or Remote"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} lg={12}>
                <Form.Item
                  name="type"
                  label={<span style={{ color: '#c1ff72' }}>Employment Type *</span>}
                  rules={[{ required: true, message: 'Please select employment type!' }]}
                >
                  <Select 
                    placeholder="Select employment type"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  >
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                    <Option value="Contract">Contract</Option>
                    <Option value="Internship">Internship</Option>
                    <Option value="Freelance">Freelance</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="salary"
                  label={<span style={{ color: '#c1ff72' }}>Salary Range</span>}
                >
                  <Input 
                    placeholder="e.g., $80,000 - $120,000 or Competitive"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} lg={12}>
                <Form.Item
                  name="experience"
                  label={<span style={{ color: '#c1ff72' }}>Experience Level</span>}
                >
                  <Select 
                    placeholder="Select experience level"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  >
                    <Option value="Entry Level">Entry Level</Option>
                    <Option value="Mid Level">Mid Level</Option>
                    <Option value="Senior">Senior</Option>
                    <Option value="Lead">Lead</Option>
                    <Option value="Manager">Manager</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label={<span style={{ color: '#c1ff72' }}>Job Description *</span>}
              rules={[{ required: true, message: 'Please enter the job description!' }]}
            >
              <TextArea 
                rows={8} 
                placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
                style={{
                  backgroundColor: '#044956',
                  border: '1px solid #044956',
                  color: '#d7f5e7'
                }}
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="requirements"
                  label={<span style={{ color: '#c1ff72' }}>Requirements</span>}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="List the key requirements and qualifications..."
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} lg={12}>
                <Form.Item
                  name="benefits"
                  label={<span style={{ color: '#c1ff72' }}>Benefits</span>}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="List the benefits and perks offered..."
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={<span style={{ color: '#c1ff72' }}>Skills & Tags</span>}>
              <div style={{ marginBottom: 16 }}>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleTagClose(tag)}
                    style={{ 
                      marginBottom: 8,
                      backgroundColor: '#044956',
                      borderColor: '#c1ff72',
                      color: '#c1ff72'
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
                {inputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    style={{ 
                      width: 100, 
                      marginRight: 8, 
                      verticalAlign: 'top',
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Tag 
                    onClick={showInput} 
                    style={{ 
                      background: '#044956', 
                      borderStyle: 'dashed',
                      borderColor: '#c1ff72',
                      color: '#c1ff72'
                    }}
                  >
                    <PlusOutlined /> New Tag
                  </Tag>
                )}
              </div>
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="companyWebsite"
                  label={<span style={{ color: '#c1ff72' }}>Company Website</span>}
                >
                  <Input 
                    placeholder="https://company.com"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} lg={12}>
                <Form.Item
                  name="applicationEmail"
                  label={<span style={{ color: '#c1ff72' }}>Application Email</span>}
                  rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
                >
                  <Input 
                    placeholder="jobs@company.com"
                    style={{
                      backgroundColor: '#044956',
                      border: '1px solid #044956',
                      color: '#d7f5e7'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={<span style={{ color: '#c1ff72' }}>Company Logo</span>}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
                maxCount={1}
                style={{
                  backgroundColor: '#044956',
                  border: '1px solid #044956'
                }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>

            <Divider style={{ borderColor: '#044956' }} />

            <Form.Item>
              <Space size="large">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{ 
                    height: 48, 
                    paddingLeft: 32, 
                    paddingRight: 32,
                    backgroundColor: '#c1ff72',
                    borderColor: '#c1ff72',
                    color: '#033f47',
                    fontWeight: 'bold'
                  }}
                >
                  Post Job
                </Button>
                <Button
                  onClick={() => navigate('/jobs')}
                  size="large"
                  style={{ 
                    height: 48, 
                    paddingLeft: 32, 
                    paddingRight: 32,
                    backgroundColor: '#044956',
                    borderColor: '#044956',
                    color: '#d7f5e7'
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Modal
        open={previewVisible}
        title="Company Logo Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        style={{
          backgroundColor: '#022e38',
          color: '#d7f5e7'
        }}
      >
        <img alt="Company Logo" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default PostJobForm; 