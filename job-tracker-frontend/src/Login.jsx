import React from 'react';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // For now, just log the values. Backend integration can be added later.
    console.log('Login values:', values);
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Login</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}> 
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login; 