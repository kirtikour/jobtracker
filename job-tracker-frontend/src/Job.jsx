import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Button, Spin, Checkbox, Row, Col, Divider, Tag, Slider, Radio } from 'antd';
import { SearchOutlined, FilterOutlined, DollarOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import Navbar from './Navbar';
import JobCard from './JobCard';

const { Option } = Select;
const { Content } = Layout;

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enhanced filter states
  const [remoteFilter, setRemoteFilter] = useState('all'); // 'all', 'remote', 'onsite'
  const [jobType, setJobType] = useState('all'); // 'all', 'full-time', 'part-time'
  const [jobField, setJobField] = useState('all'); // 'all', 'cs', 'marketing', etc.
  const [salaryRange, setSalaryRange] = useState([0, 200000]); // Min and max salary
  
  // Fields for filtering
  const jobFields = [
    { value: 'all', label: 'All Fields' },
    { value: 'cs', label: 'Computer Science' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
  ];
  
useEffect(() => {
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Fetch jobs from RemoteOK
      const remoteokRes = await fetch("https://remoteok.com/api");
      const remoteokData = await remoteokRes.json();
      const remoteokJobs = remoteokData
        .slice(1) // skip metadata
        .filter((job) => job.position && job.company)
        .map((job) => ({
          title: job.position,
          company: job.company,
          url: job.url,
          source: "RemoteOK",
        }));

      // Fetch jobs from Findwork.dev
      const findworkRes = await fetch("https://findwork.dev/api/jobs/", {
        headers: { Authorization: `3ef5a99306d619a40fb1f22de24632303998aaf8` }, // <-- replace this
      });
      const findworkData = await findworkRes.json();
      const findworkJobs = findworkData.results.map((job) => ({
        title: job.role,
        company: job.company_name,
        url: job.url,
        source: "Findwork",
      }));

      // Combine results
      const combinedJobs = [...remoteokJobs, ...findworkJobs];

      setJobs(combinedJobs);
      setFilteredJobs(combinedJobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);

  
  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [remoteFilter, jobType, jobField, salaryRange, searchTerm, jobs]);
  
  const applyFilters = () => {
    let result = [...jobs];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.position.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term)
      );
    }
    
    // Apply remote filter - enhanced to handle null location
    if (remoteFilter !== 'all') {
      result = result.filter(job => {
        const isJobRemote = 
          !job.location || // If location is null/undefined, consider it remote
          job.location.toLowerCase().includes('remote') ||
          (job.tags && job.tags.some(tag => tag.toLowerCase().includes('remote')));
        
        return remoteFilter === 'remote' ? isJobRemote : !isJobRemote;
      });
    }
    
    // Apply job type filter
    if (jobType !== 'all') {
      result = result.filter(job => {
        const jobTypeStr = job.type?.toLowerCase() || '';
        return jobType === 'full-time' ? 
          jobTypeStr.includes('full') || jobTypeStr.includes('full-time') : 
          jobTypeStr.includes('part') || jobTypeStr.includes('part-time');
      });
    }
    
    // Apply job field filter
    if (jobField !== 'all') {
      result = result.filter(job => {
        const position = job.position.toLowerCase();
        const tags = job.tags ? job.tags.map(tag => tag.toLowerCase()) : [];
        
        switch(jobField) {
          case 'cs':
            return position.includes('developer') || 
                   position.includes('engineer') || 
                   position.includes('programming') ||
                   tags.some(tag => ['developer', 'engineer', 'programming', 'code'].includes(tag));
          case 'marketing':
            return position.includes('marketing') || 
                   position.includes('seo') || 
                   position.includes('content') ||
                   tags.some(tag => ['marketing', 'seo', 'content'].includes(tag));
          case 'design':
            return position.includes('design') || 
                   position.includes('ui') || 
                   position.includes('ux') ||
                   tags.some(tag => ['design', 'ui', 'ux'].includes(tag));
          case 'sales':
            return position.includes('sales') || 
                   position.includes('business') ||
                   tags.some(tag => ['sales', 'business development'].includes(tag));
          case 'finance':
            return position.includes('finance') || 
                   position.includes('accounting') ||
                   tags.some(tag => ['finance', 'accounting'].includes(tag));
          case 'hr':
            return position.includes('hr') || 
                   position.includes('human resources') || 
                   position.includes('recruiting') ||
                   tags.some(tag => ['hr', 'human resources', 'recruiting'].includes(tag));
          default:
            return true;
        }
      });
    }
    
    // Apply salary filter (if job has salary info)
    if (salaryRange[0] > 0 || salaryRange[1] < 200000) {
      result = result.filter(job => {
        // Extract salary from job data if available
        const salary = job.salary || 0;
        return salary >= salaryRange[0] && salary <= salaryRange[1];
      });
    }
    
    setFilteredJobs(result);
  };
  
  const resetFilters = () => {
    setRemoteFilter('all');
    setJobType('all');
    setJobField('all');
    setSalaryRange([0, 200000]);
    setSearchTerm('');
  };

  return (
    <Layout style={{ 
      background: '#033f47', 
      minHeight: '100vh',
      color: 'white',
      overflowX: 'hidden'
    }}>
      <Navbar />
      
      <Content style={{ padding: '40px 100px' }}>
        {/* Search Bar - Moved to top */}
        <div style={{ marginBottom: 30 }}>
          <Input 
            placeholder="Search by job title or company" 
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              borderRadius: 8,
              height: 48,
              fontSize: 16
            }}
            size="large"
          />
        </div>
        
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ color: '#c1ff72', fontSize: 32 }}>Find Your Dream Job</h1>
          <p style={{ color: '#d7f5e7' }}>Browse through thousands of job opportunities</p>
        </div>
        
        {/* Filter Section - Redesigned */}
        <div style={{ 
          background: '#022e38', 
          padding: 24, 
          borderRadius: 12,
          marginBottom: 30,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#c1ff72', marginBottom: 16 }}>Filter Jobs</h3>
          
          <Row gutter={[24, 16]}>
            {/* Remote/Onsite Filter */}
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8, color: '#d7f5e7' }}>
                <EnvironmentOutlined /> Location
              </div>
              <Radio.Group 
                value={remoteFilter} 
                onChange={(e) => setRemoteFilter(e.target.value)}
                style={{ width: '100%' }}
                buttonStyle="solid"
              >
                <Radio.Button value="all" style={{ width: '33.3%', textAlign: 'center' }}>All</Radio.Button>
                <Radio.Button value="remote" style={{ width: '33.3%', textAlign: 'center' }}>Remote</Radio.Button>
                <Radio.Button value="onsite" style={{ width: '33.3%', textAlign: 'center' }}>Onsite</Radio.Button>
              </Radio.Group>
            </Col>
            
            {/* Job Type Filter */}
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8, color: '#d7f5e7' }}>
                <CalendarOutlined /> Job Type
              </div>
              <Select
                value={jobType}
                onChange={(value) => setJobType(value)}
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="all">All Types</Option>
                <Option value="full-time">Full Time</Option>
                <Option value="part-time">Part Time</Option>
              </Select>
            </Col>
            
            {/* Job Field Filter */}
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8, color: '#d7f5e7' }}>
                Field
              </div>
              <Select
                value={jobField}
                onChange={(value) => setJobField(value)}
                style={{ width: '100%' }}
                size="middle"
              >
                {jobFields.map(field => (
                  <Option key={field.value} value={field.value}>{field.label}</Option>
                ))}
              </Select>
            </Col>
            
            {/* Salary Range Filter */}
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8, color: '#d7f5e7' }}>
                <DollarOutlined /> Salary Range
              </div>
              <Slider 
                range 
                min={0} 
                max={200000} 
                value={salaryRange}
                onChange={(value) => setSalaryRange(value)}
                tipFormatter={value => `$${value.toLocaleString()}`}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12, color: '#a0c9c0' }}>
                <span>${salaryRange[0].toLocaleString()}</span>
                <span>${salaryRange[1].toLocaleString()}</span>
              </div>
            </Col>
          </Row>
          
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button 
              onClick={resetFilters}
              style={{ 
                borderRadius: 8,
                border: '1px solid #c1ff72',
                color: '#c1ff72',
                background: 'transparent'
              }}
            >
              Reset All Filters
            </Button>
          </div>
        </div>
        
        {/* Active Filters */}
        {(remoteFilter !== 'all' || jobType !== 'all' || jobField !== 'all' || salaryRange[0] > 0 || salaryRange[1] < 200000 || searchTerm) && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#d7f5e7' }}>Active Filters:</span>
              
              {remoteFilter !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setRemoteFilter('all')}
                  style={{ 
                    background: '#c1ff72', 
                    color: '#033f47',
                    borderRadius: 4
                  }}
                >
                  {remoteFilter === 'remote' ? 'Remote Only' : 'Onsite Only'}
                </Tag>
              )}
              
              {jobType !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setJobType('all')}
                  style={{ 
                    background: '#c1ff72', 
                    color: '#033f47',
                    borderRadius: 4
                  }}
                >
                  {jobType === 'full-time' ? 'Full Time' : 'Part Time'}
                </Tag>
              )}
              
              {jobField !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setJobField('all')}
                  style={{ 
                    background: '#c1ff72', 
                    color: '#033f47',
                    borderRadius: 4
                  }}
                >
                  {jobFields.find(f => f.value === jobField)?.label || jobField}
                </Tag>
              )}
              
              {(salaryRange[0] > 0 || salaryRange[1] < 200000) && (
                <Tag 
                  closable 
                  onClose={() => setSalaryRange([0, 200000])}
                  style={{ 
                    background: '#c1ff72', 
                    color: '#033f47',
                    borderRadius: 4
                  }}
                >
                  Salary: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                </Tag>
              )}
              
              {searchTerm && (
                <Tag 
                  closable 
                  onClose={() => setSearchTerm('')}
                  style={{ 
                    background: '#c1ff72', 
                    color: '#033f47',
                    borderRadius: 4
                  }}
                >
                  Search: {searchTerm}
                </Tag>
              )}
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div style={{ marginBottom: 20, color: '#d7f5e7' }}>
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
        
        {/* Job Listings */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: '#c1ff72' }}>Loading jobs...</p>
          </div>
        ) : (
          <div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <JobCard
                  key={job.id || index}
                  title={job.position}
                  company={job.company}
                  tags={[job.location || 'Remote', job.type || 'Full-Time']}
                  url={job.url || '#'}
                  date={job.date || new Date(job.created_at || Date.now()).toLocaleDateString()}
                />
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                background: '#022e38',
                borderRadius: 12,
                marginTop: 20
              }}>
                <p style={{ fontSize: 18 }}>No jobs match your filters.</p>
                <Button 
                  onClick={resetFilters}
                  style={{ 
                    marginTop: 16,
                    backgroundColor: '#c1ff72',
                    color: '#033f47',
                    border: 'none',
                    borderRadius: 8
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Job;