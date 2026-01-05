// src/JobCard.jsx

import React, { useState } from 'react';
import { Card, Tag, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined, EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';

const JobCard = ({ job, title, company, tags, url, date }) => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Use job object if provided, otherwise use individual props for backward compatibility
  const jobData = job || { title, company, tags, url, date };

  // Filter out URL from tags
  const displayTags = jobData.tags?.filter(tag => !tag.includes('http')) || [];

  // Extract URL from tags if present
  const jobUrl = jobData.tags?.find(tag => tag.includes('http')) || jobData.url || '#';

  const handleViewDetails = () => {
    // Generate a job ID (in a real app, this would come from the API)
    const jobId = jobData.id || `${jobData.company}-${jobData.title}`.replace(/\s+/g, '-').toLowerCase();
    navigate(`/job/${jobId}`);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking apply button

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('authToken');

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
        className="job-card"
        style={{
          marginBottom: 16,
          borderRadius: 12,
          backgroundColor: isHovered ? theme.colors.tertiaryBg : theme.colors.cardBg,
          borderColor: theme.colors.border,
          color: theme.colors.textPrimary,
          minHeight: '70px',
          padding: '12px',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-3px)' : 'none',
          boxShadow: isHovered ? '0 6px 12px rgba(0,0,0,0.2)' : 'none',
          cursor: 'pointer',
          border: `1px solid ${theme.colors.border}`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: theme.colors.accent,
              margin: 0,
              fontSize: '16px'
            }}>{jobData.title}</h3>
            <h4 style={{
              margin: '2px 0',
              color: theme.colors.textPrimary,
              fontSize: '14px'
            }}>{jobData.company}</h4>

            {/* Date display */}
            {jobData.date && (
              <div style={{
                fontSize: '12px',
                color: theme.colors.textSecondary,
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CalendarOutlined /> {jobData.date}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
            <Button
              icon={
                user?.favoriteJobs?.some(fav => fav.jobId === (jobData.id || `${jobData.company}-${jobData.title}`.replace(/\s+/g, '-').toLowerCase()))
                  ? <HeartFilled style={{ color: '#ff4d4f' }} />
                  : <HeartOutlined />
              }
              style={{
                height: 32,
                backgroundColor: 'transparent',
                color: user?.favoriteJobs?.some(fav => fav.jobId === (jobData.id || `${jobData.company}-${jobData.title}`.replace(/\s+/g, '-').toLowerCase()))
                  ? '#ff4d4f'
                  : theme.colors.accent,
                border: `1px solid ${user?.favoriteJobs?.some(fav => fav.jobId === (jobData.id || `${jobData.company}-${jobData.title}`.replace(/\s+/g, '-').toLowerCase())) ? '#ff4d4f' : theme.colors.accent}`,
                borderRadius: 8,
                fontSize: '13px'
              }}
              onClick={async (e) => {
                e.stopPropagation();
                if (!localStorage.getItem('authToken')) {
                  message.warning('Please log in to save jobs');
                  navigate('/auth');
                  return;
                }

                const jobId = jobData.id || `${jobData.company}-${jobData.title}`.replace(/\s+/g, '-').toLowerCase();
                const isFav = user?.favoriteJobs?.some(fav => fav.jobId === jobId);
                const token = localStorage.getItem('authToken');

                try {
                  let res;
                  if (isFav) {
                    // Remove
                    res = await fetch(`http://localhost:5000/api/users/favorites/${jobId}`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                  } else {
                    // Add
                    res = await fetch('http://localhost:5000/api/users/favorites', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        jobId,
                        jobTitle: jobData.title,
                        company: jobData.company,
                        location: jobData.location || 'Remote',
                        jobUrl: jobUrl
                      })
                    });
                  }

                  if (res.ok) {
                    const updatedFavorites = await res.json();
                    updateUser({ favoriteJobs: updatedFavorites });
                    message.success(isFav ? 'Removed from favorites' : 'Added to favorites');
                  }
                } catch (err) {
                  console.error('Error updating favorites:', err);
                  message.error('Failed to update favorites');
                }
              }}
            />
            <Button
              icon={<EyeOutlined />}
              style={{
                height: 32,
                backgroundColor: 'transparent',
                color: theme.colors.accent,
                border: `1px solid ${theme.colors.accent}`,
                borderRadius: 8,
                fontSize: '13px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              View
            </Button>
            <Button
              style={{
                height: 32,
                backgroundColor: isHovered ? theme.colors.secondary : theme.colors.accent,
                color: theme.colors.primaryBg,
                border: 'none',
                borderRadius: 8,
                fontSize: '13px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease'
              }}
              onClick={handleApplyClick}
            >
              Apply Now
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 6 }}>
          {displayTags.slice(0, 5).map((tag, index) => (
            <Tag
              key={index}
              style={{
                marginBottom: 4,
                marginRight: 6,
                backgroundColor: theme.colors.accent,
                color: theme.colors.primaryBg,
                fontWeight: 500,
                borderRadius: 4,
                fontSize: '11px',
                padding: '0 6px',
                lineHeight: '18px',
                border: 'none'
              }}
            >
              {tag}
            </Tag>
          ))}
          {displayTags.length > 5 && (
            <Tag
              style={{
                marginBottom: 4,
                marginRight: 6,
                backgroundColor: theme.colors.secondaryBg,
                color: theme.colors.textSecondary,
                fontWeight: 500,
                borderRadius: 4,
                fontSize: '11px',
                padding: '0 6px',
                lineHeight: '18px',
                border: `1px solid ${theme.colors.border}`
              }}
            >
              +{displayTags.length - 5} more
            </Tag>
          )}
        </div>
      </Card>

      <Modal
        title="External Link"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)} style={{
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary
          }}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmRedirect}
            style={{ backgroundColor: theme.colors.accent, color: theme.colors.primaryBg, borderColor: theme.colors.accent }}
          >
            Yes, Continue
          </Button>,
        ]}
      >
        <p style={{ color: theme.colors.textPrimary }}>This link will take you to an external website. Are you sure you want to continue?</p>
      </Modal>
    </>
  );
};

export default JobCard;
