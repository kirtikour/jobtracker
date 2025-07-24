// src/JobCard.jsx

import React, { useState } from 'react';
import { Card, Tag, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined } from '@ant-design/icons';

const JobCard = ({ title, company, tags, url, date }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Filter out URL from tags
  const displayTags = tags.filter(tag => !tag.includes('http'));
  
  // Extract URL from tags if present
  const jobUrl = tags.find(tag => tag.includes('http')) || url || '#';
  
  const handleApplyClick = () => {
    // Check if user is logged in (you'll need to implement this based on your auth system)
    const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!isLoggedIn) {
      message.warning('Please log in to apply for this job');
      navigate('/auth');
      return;
    }
    
    // If logged in, show confirmation modal
    setIsModalVisible(true);
  };
  
  const handleConfirmRedirect = () => {
    setIsModalVisible(false);
    // Open the job URL in a new tab
    window.open(jobUrl, '_blank');
  };
  
  return (
    <>
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 12,
          backgroundColor: isHovered ? '#033f4f' : '#022e38',
          color: 'white',
          minHeight: '70px',
          padding: '12px',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-3px)' : 'none',
          boxShadow: isHovered ? '0 6px 12px rgba(0,0,0,0.2)' : 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ 
              color: '#c1ff72', 
              margin: 0, 
              fontSize: '16px'
            }}>{title}</h3>
            <h4 style={{ 
              margin: '2px 0',
              color: '#e8f7ee',
              fontSize: '14px'
            }}>{company}</h4>
            
            {/* Date display */}
            {date && (
              <div style={{ 
                fontSize: '12px', 
                color: '#a0c9c0', 
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CalendarOutlined /> {date}
              </div>
            )}
          </div>
          <Button
            style={{
              height: 32,
              backgroundColor: isHovered ? '#d2ff8f' : '#c1ff72',
              color: '#033f47',
              border: 'none',
              borderRadius: 8,
              whiteSpace: 'nowrap',
              marginLeft: 16,
              flexShrink: 0,
              fontSize: '13px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onClick={handleApplyClick}
          >
            Apply Now
          </Button>
        </div>

        <div style={{ marginTop: 6 }}>
          {displayTags.map((tag, index) => (
            <Tag
              key={index}
              style={{
                marginBottom: 4,
                marginRight: 6,
                backgroundColor: '#c1ff72',
                color: '#022c33',
                fontWeight: 500,
                borderRadius: 4,
                fontSize: '11px',
                padding: '0 6px',
                lineHeight: '18px',
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </Card>
      
      <Modal
        title="External Link"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handleConfirmRedirect}
            style={{ backgroundColor: '#c1ff72', color: '#033f47' }}
          >
            Yes, Continue
          </Button>,
        ]}
      >
        <p>This link will take you to an external website. Are you sure you want to continue?</p>
      </Modal>
    </>
  );
};

export default JobCard;
