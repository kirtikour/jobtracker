import React from 'react';
import { Form, Input, Button, Select, DatePicker, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const statusOptions = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

const AddJobForm = ({ onAddJob }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const job = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      notes: values.notes || '',
    };
    onAddJob(job);
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Add New Job</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="company" label="Company Name" rules={[{ required: true, message: 'Please enter the company name' }]}> 
          <Input placeholder="e.g. Google" />
        </Form.Item>
        <Form.Item name="title" label="Job Title" rules={[{ required: true, message: 'Please enter the job title' }]}> 
          <Input placeholder="e.g. Frontend Developer" />
        </Form.Item>
        <Form.Item name="status" label="Application Status" rules={[{ required: true, message: 'Please select status' }]}> 
          <Select placeholder="Select status">
            {statusOptions.map(opt => <Option value={opt.value} key={opt.value}>{opt.label}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="Application Date" rules={[{ required: true, message: 'Please select the application date' }]}> 
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea placeholder="e.g. Reached out to recruiter, waiting for response..." rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Add Job</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddJobForm; 