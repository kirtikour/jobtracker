import React, { useState } from 'react';
import { Menu, Input, Button, Avatar, Layout, Dropdown, Space } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from './assets/logo.png';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleMenuClick = (key) => {
    switch(key) {
      case 'home':
        navigate('/');
        break;
      case 'jobs':
        navigate('/jobs');
        break;
      case 'companies':
        navigate('/companies');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['home'];
    if (path === '/jobs') return ['jobs'];
    if (path === '/companies') return ['companies'];
    if (path === '/resources') return ['resources'];
    if (path === '/dashboard') return ['dashboard'];
    return [];
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return names[0].charAt(0);
  };

  return (
    <Header style={{
      backgroundColor: '#033f47',
      display: 'flex',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ width: 65, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKey()}
          onClick={({ key }) => handleMenuClick(key)}
          style={{
            background: 'transparent',
            color: 'white',
            fontWeight: 500,
            border: 'none'
          }}
          items={[
            { key: 'home', label: 'Home' },
            { key: 'jobs', label: 'Jobs' },
            { key: 'companies', label: 'Companies' },
            { key: 'resources', label: 'Resources' },
            ...(isAuthenticated ? [{ key: 'dashboard', label: 'Dashboard' }] : [])
          ]}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 200, borderRadius: 8, background: '#f1fff0' }}
        />
        
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#c1ff72', fontWeight: 500 }}>
              Welcome, {user?.name?.split(' ')[0]}
            </span>
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ 
                    backgroundColor: '#c1ff72', 
                    color: '#033f47',
                    fontWeight: 'bold'
                  }}
                >
                  {getUserInitials(user?.name)}
                </Avatar>
                <DownOutlined style={{ color: '#c1ff72', fontSize: 12 }} />
              </Space>
            </Dropdown>
          </div>
        ) : (
          <>
            <Button 
              style={{
                borderRadius: 20,
                padding: '0 20px',
                backgroundColor: '#c1ff72',
                color: '#033f47',
                border: 'none',
                fontWeight: 600
              }}
              onClick={() => navigate('/post-job')}
            >
              Post a Job
            </Button>
            <Button 
              type="primary"
              style={{
                borderRadius: 20,
                padding: '0 20px',
                backgroundColor: 'transparent',
                color: '#c1ff72',
                border: '1px solid #c1ff72',
                fontWeight: 600
              }}
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
