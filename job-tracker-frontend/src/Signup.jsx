import React from 'react';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const Signup = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // For now, just log the values. Backend integration can be added later.
    console.log('Signup values:', values);
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}> 
          <Input placeholder="Your Name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter a password' }]}> 
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Sign Up</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup; 