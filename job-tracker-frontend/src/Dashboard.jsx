import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Layout, Row, Col, Card, Tag, Typography, Statistic, Button, Avatar, List, Menu, Divider, Upload, Progress, Space, message, Input, Form, Select, Modal, Badge, DatePicker, TimePicker } from 'antd';
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  StarOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  SettingOutlined,
  LinkOutlined,
  DeleteOutlined,
  DownloadOutlined,
  TrophyOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Leaderboard from './Leaderboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import JobRecommendations from './JobRecommendations';
// PDF.js imports - FIXED
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

import { useTheme } from './ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const [selectedMenuItem, setSelectedMenuItem] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedCV, setUploadedCV] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [quickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [quickAddForm] = Form.useForm();
  const [userProfile, setUserProfile] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [cvExtractionStatus, setCvExtractionStatus] = useState("");
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [scheduleForm] = Form.useForm();
  const [reminders, setReminders] = useState([]);


  // Form instances
  const [profileForm] = Form.useForm();

  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();

  // Check if backend server is running
  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      if (response.ok) {
        console.log('✅ Backend server is running');
        return true;
      }
    } catch (error) {
      console.error('❌ Backend server is not running:', error);
      message.warning('⚠️ Backend server is not running. Some features may not work.');
      return false;
    }
  };

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  // Fetch user applications
  const fetchApplications = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/jobs/user/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        console.log('Fetched applications:', data);
      } else {
        console.error('Failed to fetch applications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/jobs/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Show specific notifications based on status change
        if (newStatus === 'Interview') {
          message.success('🎯 Interview Scheduled! Great! You have an interview. Don\'t forget to prepare!');
        } else if (newStatus === 'Offer') {
          message.success('🎉 Offer Received! Congratulations! You received a job offer!');
        } else if (newStatus === 'Rejected') {
          message.info('📝 Application Updated to Rejected. Keep applying!');
        } else if (newStatus === 'Pending Test') {
          message.info('📋 Test Pending! Make sure to complete the test on time.');
        } else {
          message.success(`📝 Status Updated to ${newStatus}`);
        }
        fetchApplications(); // Refresh the list
      } else {
        message.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      message.error('Failed to update application status');
    }
  };

  const handleQuickAddApplication = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      const applicationData = {
        jobTitle: values.jobTitle,
        company: values.company,
        jobUrl: values.jobUrl || '',
        appliedDate: new Date().toISOString(),
        status: values.status || 'Applied',
        location: values.location || '',
        salary: values.salary || '',
        notes: values.notes || ''
      };

      const response = await fetch('http://localhost:5000/api/jobs/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        message.success('✅ Application added successfully!');
        quickAddForm.resetFields();
        setQuickAddModalVisible(false);
        fetchApplications(); // Refresh the list
      } else {
        message.error('Failed to add application');
      }
    } catch (error) {
      console.error('Error adding application:', error);
      message.error('Failed to add application');
    }
  };

  const handleScheduleInterview = async (values) => {
    try {
      const token = localStorage.getItem('authToken');

      // Format date and time
      const interviewDate = values.interviewDate.format('YYYY-MM-DD');
      const interviewTime = values.interviewTime.format('HH:mm');
      const reminderHours = parseInt(values.reminder);

      // Create reminder time
      const reminderTime = new Date(`${interviewDate}T${interviewTime}`);
      reminderTime.setHours(reminderTime.getHours() - reminderHours);

      // Add to reminders
      const newReminder = {
        id: Date.now(),
        title: `Interview: ${selectedApplication.jobTitle} at ${selectedApplication.company}`,
        date: interviewDate,
        time: interviewTime,
        type: values.interviewType,
        reminderTime: reminderTime.toISOString(),
        applicationId: selectedApplication.id
      };

      setReminders(prev => [...prev, newReminder]);

      // Update application status to Interview
      const response = await fetch(`http://localhost:5000/api/jobs/applications/${selectedApplication.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Interview',
          interviewDate: `${interviewDate}T${interviewTime}:00`,
          interviewType: values.interviewType,
          interviewer: values.interviewer || '',
          interviewNotes: values.notes || ''
        })
      });

      if (response.ok) {
        message.success('✅ Interview scheduled successfully! Reminder set.');
        setScheduleModalVisible(false);
        setSelectedApplication(null);
        scheduleForm.resetFields();
        fetchApplications(); // Refresh the list

        // Set reminder notification
        setTimeout(() => {
          if (reminderTime > new Date()) {
            const timeUntilReminder = reminderTime.getTime() - new Date().getTime();
            setTimeout(() => {
              message.info(`🔔 Reminder: You have an interview in ${reminderHours} hour(s)!`);
            }, timeUntilReminder);
          }
        }, 1000);
      } else {
        message.error('Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      message.error('Failed to schedule interview');
    }
  };







  // Initialize user profile and fetch applications
  useEffect(() => {
    if (user) {
      // Load user profile from backend with localStorage fallback
      const loadUserProfile = async () => {
        try {
          // First try to load from localStorage
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setUserProfile(parsedProfile);
            setAvatarUrl(parsedProfile.avatar);
          }

          // Then try to load from backend
          const token = localStorage.getItem('authToken');
          const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const profileData = await response.json();
            const updatedProfile = {
              name: profileData.name || user.name || '',
              email: profileData.email || user.email || '',
              phone: profileData.phone || user.phone || '',
              address: profileData.address || user.address || '',
              bio: profileData.bio || user.bio || '',
              skills: profileData.skills || user.skills || [],
              experience: profileData.experience || user.experience || '',
              education: profileData.education || user.education || '',
              linkedin: profileData.linkedin || user.linkedin || '',
              github: profileData.github || user.github || '',
              website: profileData.website || user.website || '',
              avatar: profileData.avatar || user.avatar || null,
              cvData: profileData.cvData || user.cvData || null,
              uploadedCV: profileData.uploadedCV || user.uploadedCV || null
            };
            setUserProfile(updatedProfile);
            setAvatarUrl(updatedProfile.avatar);

            // Update form values with loaded profile data
            profileForm.setFieldsValue({
              name: updatedProfile.name || '',
              email: updatedProfile.email || '',
              phone: updatedProfile.phone || '',
              address: updatedProfile.address || '',
              bio: updatedProfile.bio || '',
              skills: updatedProfile.skills ? updatedProfile.skills.join(', ') : '',
              experience: updatedProfile.experience || '',
              education: updatedProfile.education || '',
              linkedin: updatedProfile.linkedin || '',
              github: updatedProfile.github || '',
              website: updatedProfile.website || ''
            });

            // Save to localStorage
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          } else {
            // Fallback to user data if profile fetch fails
            const fallbackProfile = {
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || '',
              bio: user.bio || '',
              skills: user.skills || [],
              experience: user.experience || '',
              education: user.education || '',
              linkedin: user.linkedin || '',
              github: user.github || '',
              website: user.website || '',
              avatar: user.avatar || null,
              cvData: user.cvData || null,
              uploadedCV: user.uploadedCV || null
            };
            setUserProfile(fallbackProfile);
            setAvatarUrl(fallbackProfile.avatar);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to user data
          const fallbackProfile = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            bio: user.bio || '',
            skills: user.skills || [],
            experience: user.experience || '',
            education: user.education || '',
            linkedin: user.linkedin || '',
            github: user.github || '',
            website: user.website || '',
            avatar: user.avatar || null,
            cvData: user.cvData || null,
            uploadedCV: user.uploadedCV || null
          };
          setUserProfile(fallbackProfile);
          setAvatarUrl(fallbackProfile.avatar);
        }
      };

      loadUserProfile();

      // Set form values
      profileForm.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        experience: user.experience || '',
        education: user.education || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        website: user.website || ''
      });

      // Fetch applications when user is loaded
      fetchApplications();
    }
  }, [user]);

  // ... existing useEffect and other functions ...

  // FIXED: Real PDF data extraction function
  const extractDataFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }

      console.log('Extracted PDF text:', fullText); // Debug log

      // Parse the extracted text to find relevant information
      const extractedData = parseResumeText(fullText);
      return extractedData;

    } catch (error) {
      console.error('PDF parsing error:', error);
      throw error;
    }
  };

  // IMPROVED: Function to parse resume text and extract structured data with better accuracy
  const parseResumeText = (text) => {
    console.log('Parsing text:', (text || '').substring(0, 200) + '...'); // Debug log

    if (!text) return {};

    const lowerText = text.toLowerCase();

    // Extract name (improved patterns)
    let name = '';
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/,
      /name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
      /([A-Z][A-Z\s]+)(?=\s*\n|\s*[a-z])/,
      /([A-Z][a-z]+ [A-Z][a-z]+)(?=\s*\n|\s*email|\s*phone|\s*address)/i
    ];

    for (const pattern of namePatterns) {
      const match = text && text.match(pattern);
      if (match && match[1] && match[1].length > 3 && match[1].length < 50) {
        name = match[1].trim();
        break;
      }
    }

    // Extract phone number (improved patterns)
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      /phone[:\s]*(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/i,
      /mobile[:\s]*(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/i,
      /tel[:\s]*(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/i
    ];

    let phone = '';
    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        phone = match[0].replace(/phone[:\s]*/i, '').replace(/mobile[:\s]*/i, '').replace(/tel[:\s]*/i, '').trim();
        break;
      }
    }

    // Extract email (improved pattern)
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract social links
    const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s)]+/i);
    const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s)]+/i);
    const websiteMatch = text.match(/(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    const linkedin = linkedinMatch ? linkedinMatch[0].trim() : '';
    const github = githubMatch ? githubMatch[0].trim() : '';
    const website = websiteMatch ? websiteMatch[0].trim() : '';

    // Extract skills (expanded list and better detection)
    const skillKeywords = [
      'javascript', 'react', 'node.js', 'nodejs', 'python', 'java', 'html', 'css',
      'sql', 'mongodb', 'express', 'angular', 'vue', 'typescript', 'php', 'c++',
      'c#', 'ruby', 'go', 'swift', 'kotlin', 'docker', 'kubernetes', 'aws',
      'azure', 'git', 'github', 'mysql', 'postgresql', 'redis', 'elasticsearch',
      'spring', 'django', 'flask', 'laravel', 'bootstrap', 'jquery', 'webpack',
      'babel', 'sass', 'less', 'graphql', 'rest api', 'microservices', 'machine learning',
      'ai', 'artificial intelligence', 'data science', 'big data', 'hadoop', 'spark',
      'tableau', 'power bi', 'excel', 'word', 'powerpoint', 'photoshop', 'illustrator',
      'figma', 'sketch', 'adobe', 'agile', 'scrum', 'kanban', 'devops', 'ci/cd',
      'jenkins', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'teams'
    ];

    const foundSkills = skillKeywords.filter(skill =>
      lowerText && lowerText.includes(skill.toLowerCase())
    ).map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));

    // Extract experience (improved patterns)
    const expPatterns = [
      /(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i,
      /experience[:\s]*(\d+)\+?\s*years?/i,
      /(\d+)\+?\s*years?\s*experience/i,
      /(\d+)\+?\s*years?\s*in\s*(software|development|programming)/i
    ];

    let experience = '';
    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) {
        const years = match[1];
        experience = `${years}+ years of experience`;
        break;
      }
    }

    // Extract education (improved detection)
    const eduPatterns = [
      /(bachelor|master|phd|doctorate|degree|diploma|certificate).*?(computer science|engineering|business|mathematics|physics|chemistry|information technology|it)/i,
      /(university|college|institute).*?(computer science|engineering|business|information technology)/i,
      /education[:\s]*(.*?)(?=\n|$)/i,
      /(bs|ms|phd|bachelor|master).*?(computer science|engineering|business)/i
    ];

    let education = '';
    for (const pattern of eduPatterns) {
      const match = text.match(pattern);
      if (match) {
        education = match[0].trim();
        break;
      }
    }

    // Extract bio/summary (improved detection)
    const bioPatterns = [
      /summary[:\s]*(.*?)(?=\n\n|\nexperience|\neducation|\nskills|$)/is,
      /objective[:\s]*(.*?)(?=\n\n|\nexperience|\neducation|\nskills|$)/is,
      /profile[:\s]*(.*?)(?=\n\n|\nexperience|\neducation|\nskills|$)/is,
      /about[:\s]*(.*?)(?=\n\n|\nexperience|\neducation|\nskills|$)/is
    ];

    let bio = '';
    for (const pattern of bioPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        bio = match[1].trim().substring(0, 200); // Limit bio length
        break;
      }
    }

    // Extract address (new)
    const addressPatterns = [
      /address[:\s]*(.*?)(?=\n|$)/i,
      /location[:\s]*(.*?)(?=\n|$)/i,
      /city[:\s]*(.*?)(?=\n|$)/i
    ];

    let address = '';
    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        address = match[1].trim();
        break;
      }
    }

    const result = {
      name: name || userProfile.name || user?.name || '',
      phone: phone || userProfile.phone || user?.phone || '',
      email: email || userProfile.email || user?.email || '',
      address: address || userProfile.address || user?.address || '',
      experience: experience || userProfile.experience || '',
      education: education || userProfile.education || '',
      skills: foundSkills.length > 0 ? foundSkills : userProfile.skills || [],
      bio: bio || userProfile.bio || user?.bio || '',
      linkedin: linkedin || userProfile.linkedin || user?.linkedin || '',
      github: github || userProfile.github || user?.github || '',
      website: website || userProfile.website || user?.website || ''
    };

    console.log('Extracted data:', result);
    return result;
  };

  // CV Upload functionality with REAL PDF parsing - IMPROVED
  const handleCVUpload = async (file) => {
    const isValidType = file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isValidType) {
      message.error('Please upload a PDF, DOC, or DOCX file');
      return false;
    }

    const isValidSize = file.size / 1024 / 1024 < 5; // 5MB limit
    if (!isValidSize) {
      message.error('File size must be less than 5MB');
      return false;
    }

    setUploadedCV(file);
    setIsProcessingCV(true);
    setCvExtractionStatus('Uploading CV...');
    message.loading('Uploading CV...', 0);

    // Parse PDF if it's a PDF file
    if (file.type === 'application/pdf') {
      try {
        setCvExtractionStatus('Extracting data from CV...');
        message.loading('Extracting data from CV...', 0);

        const extractedData = await extractDataFromPDF(file);
        setCvData(extractedData);

        // Merge extracted data with existing profile data
        const mergedProfile = {
          ...userProfile,
          ...extractedData
        };

        // Update user profile state
        setUserProfile(mergedProfile);

        // Auto-fill profile form with merged data (preserving existing data)
        const currentFormValues = profileForm.getFieldsValue();
        const newFormValues = {
          ...currentFormValues,
          ...extractedData,
          // Ensure skills is a comma-separated string for the form input
          skills: Array.isArray(extractedData.skills) ? extractedData.skills.join(', ') : (extractedData.skills || '')
        };

        profileForm.setFieldsValue(newFormValues);

        message.destroy();
        message.success('✅ CV uploaded and data extracted successfully!');
        setCvExtractionStatus('Data extracted successfully! Check your profile details.');

        // Show success message with guidance
        setTimeout(() => {
          message.info('💡 Review and edit the extracted information in your profile section.');
        }, 2000);

      } catch (error) {
        console.error('Error parsing CV:', error);
        message.destroy();
        message.warning('⚠️ CV uploaded but data extraction failed. Please fill in details manually.');
        setCvExtractionStatus('Extraction failed. Please fill details manually.');
        setCvData({
          name: userProfile.name || user?.name || '',
          phone: userProfile.phone || user?.phone || '',
          email: userProfile.email || user?.email || ''
        });
      }
    } else {
      message.destroy();
      message.success('✅ CV uploaded successfully! Please fill in details manually.');
      setCvExtractionStatus('CV uploaded. Please fill details manually.');
    }

    setIsProcessingCV(false);
    return false; // Prevent automatic upload
  };


  // ADDED: Real PDF data extraction function
  // const extractDataFromPDF = async (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       try {
  //         const typedArray = new Uint8Array(e.target.result);

  //         // Import PDF.js dynamically
  //         const pdfjsLib = await import('pdfjs-dist/webpack');

  //         const pdf = await pdfjsLib.getDocument(typedArray).promise;
  //         let fullText = '';

  //         // Extract text from all pages
  //         for (let i = 1; i <= pdf.numPages; i++) {
  //           const page = await pdf.getPage(i);
  //           const textContent = await page.getTextContent();
  //           const pageText = textContent.items.map(item => item.str).join(' ');
  //           fullText += pageText + ' ';
  //         }

  //         // Parse the extracted text to find relevant information
  //         const extractedData = parseResumeText(fullText);
  //         resolve(extractedData);

  //       } catch (error) {
  //         console.error('PDF parsing error:', error);
  //         reject(error);
  //       }
  //     };

  //     reader.onerror = () => reject(new Error('Failed to read file'));
  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  // ADDED: Function to parse resume text and extract structured data
  // const parseResumeText = (text) => {
  //   const lowerText = text.toLowerCase();

  //   // Extract name (usually at the beginning)
  //   const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
  //   const name = nameMatch ? nameMatch[1] : '';

  //   // Extract phone number
  //   const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  //   const phone = phoneMatch ? phoneMatch[0] : '';

  //   // Extract email
  //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  //   const email = emailMatch ? emailMatch[0] : '';

  //   // Extract skills (look for common skill keywords)
  //   const skillKeywords = ['javascript', 'react', 'node.js', 'python', 'java', 'html', 'css', 'sql', 'mongodb', 'express', 'angular', 'vue', 'typescript', 'php', 'c++', 'c#', 'ruby', 'go', 'swift', 'kotlin'];
  //   const foundSkills = skillKeywords.filter(skill => lowerText.includes(skill));

  //   // Extract experience (look for years of experience)
  //   const expMatch = text.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i);
  //   const experience = expMatch ? `${expMatch[1]}+ years of experience` : '';

  //   // Extract education (look for degree keywords)
  //   const eduKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'computer science', 'engineering', 'business'];
  //   const eduMatch = eduKeywords.find(keyword => lowerText.includes(keyword));
  //   const education = eduMatch ? `Degree in ${eduMatch}` : '';

  //   return {
  //     name: name || userProfile.name || user.name || '',
  //     phone: phone || userProfile.phone || user.phone || '',
  //     email: email || userProfile.email || user.email || '',
  //     experience: experience || userProfile.experience || '',
  //     education: education || userProfile.education || '',
  //     skills: foundSkills.length > 0 ? foundSkills : userProfile.skills || [],
  //     bio: userProfile.bio || user.bio || 'Professional with expertise in software development'
  //   };
  // };

  const removeCVFile = () => {
    setUploadedCV(null);
    setCvData(null);
    setPdfText("");
    // Update userProfile to remove CV data
    const updatedProfile = { ...userProfile, uploadedCV: null, cvData: null };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    message.info('CV removed');
  };

  const downloadCV = () => {
    if (uploadedCV) {
      // Create a download link for the CV file
      const link = document.createElement('a');
      link.href = uploadedCV.url || URL.createObjectURL(uploadedCV);
      link.download = uploadedCV.name || 'my-cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('✅ CV downloaded successfully!');
    } else {
      message.error('No CV file available for download');
    }
  };

  // IMPROVED: Profile update with backend integration
  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      message.loading('Updating profile...', 0);

      console.log('Updating profile with values:', values);

      // Prepare data for backend (only send relevant profile fields)
      const backendData = {
        name: values.name ?? userProfile.name,
        email: values.email ?? userProfile.email,
        phone: values.phone ?? userProfile.phone,
        address: values.address ?? userProfile.address,
        bio: values.bio ?? userProfile.bio,
        // Fix: Handle both array (from CV parser) and string (from user input)
        skills: Array.isArray(values.skills)
          ? values.skills
          : (values.skills !== undefined ? values.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : userProfile.skills || []),
        experience: values.experience ?? userProfile.experience,
        education: values.education ?? userProfile.education,
        linkedin: values.linkedin ?? userProfile.linkedin,
        github: values.github ?? userProfile.github,
        website: values.website ?? userProfile.website
      };

      console.log('Backend payload:', backendData);

      // Send to backend
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      if (response.ok) {
        const backendResponse = await response.json();

        // Merge backend response with local CV data
        const updatedProfile = {
          ...backendResponse,
          cvData: userProfile.cvData,
          uploadedCV: userProfile.uploadedCV
        };

        // Update local state
        setUserProfile(updatedProfile);

        // Update user context
        if (updateUser) {
          updateUser({ ...user, ...updatedProfile });
        }

        // Save to localStorage for persistence
        try {
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }

        message.destroy();
        message.success('✅ Profile updated successfully!');

        setEditingProfile(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.destroy();

      if (error.message.includes('Failed to fetch')) {
        message.error('❌ Cannot connect to server. Please make sure the backend is running.');
      } else if (error.message.includes('Email is already in use')) {
        message.error('❌ This email is already registered by another user. Please use a different email.');
      } else {
        message.error(`❌ Failed to update profile: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'Applied' || app.status === 'Pending Test').length;
  const interviewApplications = applications.filter(app => app.status === 'Interview').length;
  const offerApplications = applications.filter(app => app.status === 'Offer').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'blue';
      case 'Pending Test': return 'orange';
      case 'Interview': return 'purple';
      case 'Offer': return 'green';
      case 'Rejected': return 'red';
      default: return 'default';
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return names[0].charAt(0);
  };

  const sidebarMenuItems = [
    {
      key: 'applications',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'leaderboard',
      icon: <TrophyOutlined />,
      label: 'Leaderboard',
    },
    {
      key: 'cv',
      icon: <FileTextOutlined />,
      label: 'My CV',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Edit Profile',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: 'recommendations',
      icon: <StarOutlined />,
      label: 'Job Recommendations',
    },
  ];

  const renderMyApplications = () => (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="statistic-card" style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.accent }}>Total Applications</span>}
              value={totalApplications}
              valueStyle={{ color: theme.colors.textPrimary, fontSize: 32, fontWeight: 'bold' }}
              prefix={<AppstoreOutlined style={{ color: theme.colors.accent }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="statistic-card" style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.accent }}>Pending</span>}
              value={pendingApplications}
              valueStyle={{ color: theme.colors.textPrimary, fontSize: 32, fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined style={{ color: theme.colors.accent }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="statistic-card" style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.accent }}>Interviews</span>}
              value={interviewApplications}
              valueStyle={{ color: theme.colors.textPrimary, fontSize: 32, fontWeight: 'bold' }}
              prefix={<CalendarOutlined style={{ color: theme.colors.accent }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="statistic-card" style={{ backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` }}>
            <Statistic
              title={<span style={{ color: theme.colors.accent }}>Offers</span>}
              value={offerApplications}
              valueStyle={{ color: theme.colors.textPrimary, fontSize: 32, fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: theme.colors.accent }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: theme.colors.accent, fontSize: 18 }}>Recent Applications</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="primary"
                className="quick-add-button"
                icon={<PlusOutlined />}
                onClick={() => setQuickAddModalVisible(true)}
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
                  fontWeight: 'bold'
                }}
              >
                Quick Add
              </Button>
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={fetchApplications}
                style={{ color: theme.colors.accent }}
              >
                Refresh
              </Button>
            </div>
          </div>
        }
        style={{
          backgroundColor: theme.colors.secondaryBg,
          color: theme.colors.textPrimary,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        headStyle={{ borderBottom: `1px solid ${theme.colors.border}` }}
        extra={
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {interviewApplications > 0 && (
              <Tag className="status-badge" color="orange" style={{ margin: 0, fontWeight: 'bold' }}>
                🎯 {interviewApplications} Interview{interviewApplications > 1 ? 's' : ''} Pending
              </Tag>
            )}
            {offerApplications > 0 && (
              <Tag className="status-badge" color="green" style={{ margin: 0, fontWeight: 'bold' }}>
                🎉 {offerApplications} Offer{offerApplications > 1 ? 's' : ''} Received
              </Tag>
            )}
          </div>
        }
      >
        <List
          dataSource={applications}
          renderItem={(application) => (
            <List.Item
              className="application-item"
              style={{ borderBottom: `1px solid ${theme.colors.border}`, padding: '16px 0' }}
              actions={[
                <Button
                  type="link"
                  style={{ color: theme.colors.accent }}
                  onClick={() => window.open(application.jobUrl, '_blank')}
                >
                  View Job
                </Button>,
                <Space direction="vertical" size="small">
                  <Select
                    value={application.status}
                    onChange={(value) => updateApplicationStatus(application._id, value)}
                    style={{ width: 140 }}
                    size="small"
                  >
                    <Option value="Applied">📝 Applied</Option>
                    <Option value="Pending Test">📋 Pending Test</Option>
                    <Option value="Interview">🎯 Interview</Option>
                    <Option value="Offer">🎉 Offer</Option>
                    <Option value="Rejected">❌ Rejected</Option>
                  </Select>
                  <Button
                    type="primary"
                    size="small"
                    style={{
                      backgroundColor: theme.colors.accent,
                      borderColor: theme.colors.accent,
                      color: theme.colors.primaryBg,
                      fontWeight: 'bold'
                    }}
                    icon={<BookOutlined />}
                    onClick={() => {
                      const params = new URLSearchParams({
                        jobId: application._id,
                        jobTitle: application.jobTitle,
                        company: application.company
                      });
                      navigate(`/preparation?${params.toString()}`);
                    }}
                  >
                    Prepare for Job
                  </Button>
                  {application.status === 'Interview' && (
                    <Button
                      type="primary"
                      size="small"
                      style={{
                        backgroundColor: '#faad14',
                        borderColor: '#faad14',
                        color: '#033f47',
                        fontWeight: 'bold'
                      }}
                      icon={<CalendarOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplication(application);
                        setScheduleModalVisible(true);
                      }}
                    >
                      Schedule Interview
                    </Button>
                  )}
                </Space>
              ]}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: theme.colors.textPrimary }}>{application.jobTitle}</span>
                    {application.status === 'Interview' && (
                      <Tag color="orange" style={{ margin: 0 }}>
                        🎯 INTERVIEW SCHEDULED
                      </Tag>
                    )}
                    {application.status === 'Offer' && (
                      <Tag color="green" style={{ margin: 0 }}>
                        🎉 OFFER RECEIVED
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <div>
                    <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>{application.company}</Text>
                    <br />
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                      Applied on {new Date(application.appliedDate).toLocaleDateString()}
                    </Text>
                    {application.status === 'Interview' && (
                      <div style={{ marginTop: 8 }}>
                        <Text style={{ color: '#faad14', fontSize: 12, fontWeight: 'bold' }}>
                          ⏰ Interview Status: Pending Schedule
                        </Text>
                      </div>
                    )}
                    {application.status === 'Offer' && (
                      <div style={{ marginTop: 8 }}>
                        <Text style={{ color: '#52c41a', fontSize: 12, fontWeight: 'bold' }}>
                          💰 Offer Received - Review Required
                        </Text>
                      </div>
                    )}
                  </div>
                }
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Tag
                  color={getStatusColor(application.status)}
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '4px 8px'
                  }}
                >
                  {application.status === 'Interview' ? '🎯 INTERVIEW' :
                    application.status === 'Offer' ? '🎉 OFFER' :
                      application.status === 'Rejected' ? '❌ REJECTED' :
                        application.status === 'Pending Test' ? '📋 TEST' :
                          '📝 APPLIED'}
                </Tag>
                {application.status === 'Interview' && (
                  <Text style={{ color: '#faad14', fontSize: '10px', textAlign: 'center' }}>
                    Action Required
                  </Text>
                )}
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No applications yet' }}
        />
      </Card>
    </div>
  );

  const renderMyCV = () => (
    <Card
      title={<span style={{ color: theme.colors.accent, fontSize: 18 }}>My CV</span>}
      style={{
        backgroundColor: theme.colors.secondaryBg,
        color: theme.colors.textPrimary,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      headStyle={{ borderBottom: '1px solid #044956' }}
    >
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        {isProcessingCV ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Progress type="circle" percent={75}
                strokeColor={theme.colors.accent}
                trailColor={theme.colors.border}
                size={80}
              />
            </div>
            <Title level={4} style={{ color: theme.colors.textPrimary, marginBottom: 8 }}>
              Processing CV...
            </Title>
            <Text style={{ color: theme.colors.textSecondary, display: 'block' }}>
              {cvExtractionStatus}
            </Text>
          </div>
        ) : uploadedCV ? (
          <div>
            <FileTextOutlined style={{ fontSize: 64, color: theme.colors.accent, marginBottom: 16 }} />
            <Title level={4} style={{ color: theme.colors.textPrimary }}>{uploadedCV.name}</Title>
            <Text style={{ color: theme.colors.textSecondary, display: 'block', marginBottom: 16 }}>
              Uploaded on {new Date().toLocaleDateString()}
            </Text>

            {cvExtractionStatus && (
              <div style={{
                marginBottom: 24,
                padding: '12px 16px',
                backgroundColor: theme.colors.cardBg,
                borderRadius: 8,
                border: `1px solid ${theme.colors.accent}`
              }}>
                <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>
                  {cvExtractionStatus}
                </Text>
              </div>
            )}

            {cvData && Object.keys(cvData).some(key => cvData[key] && key !== 'name' && key !== 'email') && (
              <div style={{
                marginBottom: 24,
                textAlign: 'left',
                backgroundColor: theme.colors.cardBg,
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${theme.colors.border}`
              }}>
                <Title level={5} style={{ color: theme.colors.accent, marginBottom: 12 }}>
                  Extracted Information:
                </Title>
                {Object.entries(cvData).map(([key, value]) => {
                  if (!value || key === 'name' || key === 'email') return null;
                  return (
                    <Text style={{ color: theme.colors.textPrimary, display: "block", marginBottom: 4 }} key={key}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                      {Array.isArray(value) ? value.join(", ") : value}
                    </Text>
                  );
                })}
              </div>
            )}

            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={downloadCV}
                style={{ backgroundColor: theme.colors.accent, color: theme.colors.primaryBg, border: 'none' }}
              >
                Download
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => setSelectedMenuItem('profile')}
                style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.accent, border: `1px solid ${theme.colors.accent}` }}
              >
                Edit Profile
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={removeCVFile}
                style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }}
              >
                Remove
              </Button>
            </Space>
          </div>
        ) : (
          <div>
            <Upload.Dragger
              beforeUpload={handleCVUpload}
              showUploadList={false}
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `2px dashed ${theme.colors.accent}`,
                borderRadius: 8
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: theme.colors.accent, fontSize: 48 }} />
              </p>
              <p style={{ color: theme.colors.textPrimary, fontSize: 16, fontWeight: 'bold' }}>
                Click or drag CV file to upload
              </p>
              <p style={{ color: theme.colors.textSecondary }}>
                Support PDF, DOC, DOCX files up to 5MB
              </p>
            </Upload.Dragger>
          </div>
        )}
      </div>
    </Card>
  );


  const renderEditProfile = () => (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.colors.accent, fontSize: 18 }}>Edit Profile</span>
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingProfile(!editingProfile)}
            style={{
              backgroundColor: editingProfile ? theme.colors.cardBg : theme.colors.accent,
              color: editingProfile ? theme.colors.textPrimary : theme.colors.primaryBg,
              border: 'none',
              borderRadius: 8
            }}
          >
            {editingProfile ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      }
      style={{
        backgroundColor: theme.colors.secondaryBg,
        color: theme.colors.textPrimary,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      headStyle={{ borderBottom: `1px solid ${theme.colors.border}` }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <Avatar
              size={120}
              src={avatarUrl}
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.primaryBg,
                fontSize: 48,
                fontWeight: 'bold',
                marginBottom: 16
              }}
            >
              {!avatarUrl && getUserInitials(userProfile.name)}
            </Avatar>
          </div>
        </Col>
        <Col xs={24} md={16}>
          {editingProfile ? (
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
              style={{ color: theme.colors.textPrimary }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={<span style={{ color: theme.colors.accent }}>Full Name</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label={<span style={{ color: theme.colors.accent }}>Email</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label={<span style={{ color: theme.colors.accent }}>Phone</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label={<span style={{ color: theme.colors.accent }}>Address</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="bio"
                label={<span style={{ color: theme.colors.accent }}>Bio</span>}
              >
                <Input.TextArea
                  rows={3}
                  style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }}
                />
              </Form.Item>
              <Form.Item
                name="skills"
                label={<span style={{ color: theme.colors.accent }}>Skills (comma-separated)</span>}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                  style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="experience"
                    label={<span style={{ color: theme.colors.accent }}>Experience</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="education"
                    label={<span style={{ color: theme.colors.accent }}>Education</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="linkedin"
                    label={<span style={{ color: theme.colors.accent }}>LinkedIn</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="github"
                    label={<span style={{ color: theme.colors.accent }}>GitHub</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="website"
                    label={<span style={{ color: theme.colors.accent }}>Website</span>}
                  >
                    <Input style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.primaryBg,
                      border: 'none',
                      height: 40,
                      fontWeight: 'bold',
                      borderRadius: 8
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setEditingProfile(false)}
                    style={{
                      backgroundColor: theme.colors.cardBg,
                      color: theme.colors.textPrimary,
                      border: `1px solid ${theme.colors.cardBg}`,
                      height: 40,
                      borderRadius: 8
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Text style={{ color: theme.colors.accent, fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
                  Personal Information
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: theme.colors.textPrimary }}>{userProfile.address || 'Not provided'}</Text>
                </div>
              </div>

              {userProfile.bio && (
                <>
                  <Divider style={{ borderColor: theme.colors.border }} />
                  <div>
                    <Text style={{ color: theme.colors.accent, fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
                      Bio
                    </Text>
                    <Text style={{ color: theme.colors.textPrimary }}>{userProfile.bio}</Text>
                  </div>
                </>
              )}
              {userProfile.skills && Array.isArray(userProfile.skills) && userProfile.skills.length > 0 && (
                <div>
                  <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>Skills:</Text>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {userProfile.skills.map((skill, index) => (
                      <Tag key={index} color={theme.colors.accent} style={{ color: theme.colors.primaryBg }}>
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}


              <Divider style={{ borderColor: theme.colors.border }} />

              <div>
                <Text style={{ color: theme.colors.accent, fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
                  Professional Information
                </Text>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Experience: </Text>
                  <Text style={{ color: theme.colors.textPrimary }}>{userProfile.experience || 'Not provided'}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Education: </Text>
                  <Text style={{ color: theme.colors.textPrimary }}>{userProfile.education || 'Not provided'}</Text>
                </div>
              </div>

              {(userProfile.linkedin || userProfile.github || userProfile.website) && (
                <>
                  <Divider style={{ borderColor: theme.colors.border }} />
                  <div>
                    <Text style={{ color: theme.colors.accent, fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
                      Links
                    </Text>
                    {userProfile.linkedin && (
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>LinkedIn: </Text>
                        <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>
                          {userProfile.linkedin}
                        </a>
                      </div>
                    )}
                    {userProfile.github && (
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>GitHub: </Text>
                        <a href={userProfile.github} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>
                          {userProfile.github}
                        </a>
                      </div>
                    )}
                    {userProfile.website && (
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Website: </Text>
                        <a href={userProfile.website} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>
                          {userProfile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );

  const renderAnalyticsDashboard = () => (
    <AnalyticsDashboard
      applications={applications}
      userProfile={userProfile}
    />
  );

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'applications':
        // Refresh applications when user clicks on applications tab
        if (user && applications.length === 0) {
          fetchApplications();
        }
        return renderMyApplications();
      case 'cv':
        return renderMyCV();
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return renderEditProfile();
      case 'analytics':
        return renderAnalyticsDashboard();
      case 'recommendations':
        return <JobRecommendations />;
      default:
        return renderMyApplications();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar />

      <Layout style={{ background: 'transparent' }}>
        {/* Sidebar */}
        <Sider
          width={280}
          className="sidebar-menu"
          style={{
            background: theme.colors.secondaryBg,
            borderRight: `1px solid ${theme.colors.border}`,
            padding: '20px 0'
          }}
        >
          {/* User Profile Section */}
          <div className="avatar-container" style={{ padding: '0 20px', marginBottom: 30 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar
                size={80}
                src={avatarUrl}
                style={{
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
                  fontSize: 32,
                  fontWeight: 'bold',
                  marginBottom: 12
                }}
              >
                {getUserInitials(user.name)}
              </Avatar>
              <Title level={5} style={{ color: theme.colors.accent, margin: 0 }}>{user.name}</Title>
              <Text style={{ color: theme.colors.textPrimary, fontSize: 12 }}>{user.email}</Text>
            </div>
          </div>



          <Divider style={{ borderColor: '#044956', margin: '0 20px 20px 20px' }} />

          {/* Navigation Menu */}
          <Menu
            mode="vertical"
            selectedKeys={[selectedMenuItem]}
            onClick={({ key }) => setSelectedMenuItem(key)}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.colors.textPrimary
            }}
            items={sidebarMenuItems.map(item => ({
              ...item,
              className: 'dashboard-tab',
              style: {

                border: 'none',
                height: 40,
                lineHeight: '40px',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                color: selectedMenuItem === item.key ? theme.colors.primaryBg : theme.colors.textPrimary,
                backgroundColor: selectedMenuItem === item.key ? theme.colors.accent : 'transparent'
              }
            }))}
          />
        </Sider>

        {/* Main Content */}
        <Content className="main-content dashboard-tab-content" style={{ padding: '30px 40px', background: 'transparent' }}>
          {renderContent()}
        </Content>
      </Layout>

      {/* Quick Add Application Modal */}
      <Modal
        title={<span style={{ color: theme.colors.accent }}>📝 Quick Add Application</span>}
        open={quickAddModalVisible}
        onCancel={() => setQuickAddModalVisible(false)}
        footer={null}
        width={600}
        styles={{
          content: { backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` },
          header: { backgroundColor: theme.colors.secondaryBg, borderBottom: `1px solid ${theme.colors.border}` }
        }}
      >
        <Form
          form={quickAddForm}
          layout="vertical"
          onFinish={handleQuickAddApplication}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="jobTitle"
                label={<span style={{ color: theme.colors.accent }}>Job Title *</span>}
                rules={[{ required: true, message: 'Please enter job title!' }]}
              >
                <Input
                  placeholder="e.g., Senior React Developer"
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label={<span style={{ color: theme.colors.accent }}>Company *</span>}
                rules={[{ required: true, message: 'Please enter company name!' }]}
              >
                <Input
                  placeholder="e.g., Google"
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label={<span style={{ color: theme.colors.accent }}>Location</span>}
              >
                <Input
                  placeholder="e.g., Remote, New York"
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span style={{ color: theme.colors.accent }}>Status</span>}
                initialValue="Applied"
              >
                <Select
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                >
                  <Option value="Applied">📝 Applied</Option>
                  <Option value="Pending Test">📋 Pending Test</Option>
                  <Option value="Interview">🎯 Interview</Option>
                  <Option value="Offer">🎉 Offer</Option>
                  <Option value="Rejected">❌ Rejected</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="jobUrl"
            label={<span style={{ color: theme.colors.accent }}>Job URL (Optional)</span>}
          >
            <Input
              placeholder="https://company.com/careers/job-123"
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            />
          </Form.Item>

          <Form.Item
            name="salary"
            label={<span style={{ color: theme.colors.accent }}>Salary (Optional)</span>}
          >
            <Input
              placeholder="e.g., $80,000 - $120,000"
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label={<span style={{ color: theme.colors.accent }}>Notes (Optional)</span>}
          >
            <Input.TextArea
              rows={3}
              placeholder="Any additional notes about this application..."
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => setQuickAddModalVisible(false)}
                style={{
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
                  fontWeight: 'bold'
                }}
              >
                Add Application
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        title={<span style={{ color: theme.colors.accent }}>📅 Schedule Interview</span>}
        open={scheduleModalVisible}
        onCancel={() => {
          setScheduleModalVisible(false);
          setSelectedApplication(null);
          scheduleForm.resetFields();
        }}
        footer={null}
        styles={{
          content: { backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` },
          header: { backgroundColor: theme.colors.secondaryBg, borderBottom: `1px solid ${theme.colors.border}` }
        }}
        width={600}
      >
        {selectedApplication && (
          <div style={{ marginBottom: 24 }}>
            <Text style={{ color: theme.colors.textPrimary, fontSize: 16, fontWeight: 'bold' }}>
              {selectedApplication.jobTitle} at {selectedApplication.company}
            </Text>
          </div>
        )}

        <Form
          form={scheduleForm}
          layout="vertical"
          onFinish={handleScheduleInterview}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="interviewDate"
                label={<span style={{ color: theme.colors.accent }}>Interview Date</span>}
                rules={[{ required: true, message: 'Please select interview date!' }]}
              >
                <DatePicker
                  style={{
                    width: '100%',
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                  placeholder="Select date"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="interviewTime"
                label={<span style={{ color: theme.colors.accent }}>Interview Time</span>}
                rules={[{ required: true, message: 'Please select interview time!' }]}
              >
                <TimePicker
                  style={{
                    width: '100%',
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary
                  }}
                  placeholder="Select time"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="interviewType"
            label={<span style={{ color: theme.colors.accent }}>Interview Type</span>}
            initialValue="video"
          >
            <Select
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            >
              <Option value="video">📹 Video Call</Option>
              <Option value="phone">📞 Phone Call</Option>
              <Option value="onsite">🏢 On-site</Option>
              <Option value="technical">💻 Technical Test</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="interviewer"
            label={<span style={{ color: theme.colors.accent }}>Interviewer Name (Optional)</span>}
          >
            <Input
              placeholder="e.g., John Smith, HR Manager"
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label={<span style={{ color: theme.colors.accent }}>Interview Notes (Optional)</span>}
          >
            <Input.TextArea
              rows={3}
              placeholder="Any preparation notes, questions to ask, etc."
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            />
          </Form.Item>

          <Form.Item
            name="reminder"
            label={<span style={{ color: theme.colors.accent }}>Set Reminder</span>}
            initialValue="1"
          >
            <Select
              style={{
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary
              }}
            >
              <Option value="1">1 hour before</Option>
              <Option value="2">2 hours before</Option>
              <Option value="24">1 day before</Option>
              <Option value="168">1 week before</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => {
                  setScheduleModalVisible(false);
                  setSelectedApplication(null);
                  scheduleForm.resetFields();
                }}
                style={{
                  backgroundColor: theme.colors.cardBg,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
                  fontWeight: 'bold'
                }}
              >
                Schedule Interview
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Reminders Section */}
      {reminders.length > 0 && (
        <Modal
          title={<span style={{ color: theme.colors.accent }}>🔔 Upcoming Reminders</span>}
          open={reminders.length > 0}
          onCancel={() => setReminders([])}
          footer={[
            <Button
              key="close"
              onClick={() => setReminders([])}
              style={{
                backgroundColor: theme.colors.accent,
                borderColor: theme.colors.accent,
                color: theme.colors.primaryBg
              }}
            >
              Close
            </Button>
          ]}
          styles={{
            content: { backgroundColor: theme.colors.secondaryBg, border: `1px solid ${theme.colors.border}` },
            header: { backgroundColor: theme.colors.secondaryBg, borderBottom: `1px solid ${theme.colors.border}` }
          }}
        >
          <div>
            {reminders.map((reminder, index) => (
              <Card
                key={index}
                style={{
                  backgroundColor: theme.colors.cardBg,
                  border: `1px solid ${theme.colors.border}`,
                  marginBottom: 12
                }}
              >
                <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>
                  {reminder.title}
                </Text>
                <br />
                <Text style={{ color: theme.colors.textPrimary }}>
                  {reminder.date} at {reminder.time}
                </Text>
                <br />
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                  {reminder.type} interview
                </Text>
              </Card>
            ))}
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Dashboard;