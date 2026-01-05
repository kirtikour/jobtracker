import React, { useState } from 'react';
import { Menu, Input, Button, Avatar, Layout, Dropdown, Space, Modal } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, DownOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

import './SidebarMenu.css';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuClick = (key) => {
    switch (key) {
      case 'home':
        navigate('/');
        break;
      case 'jobs':
        navigate('/jobs');
        break;
      case 'companies':
        navigate('/companies');
        break;
      case 'Preparation':
        navigate('/Preparation');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
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
    if (path === '/Preparation') return ['Preparation'];
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

  const navStyles = `
    .ant-menu-horizontal {
      line-height: 46px;
      border-bottom: none !important;
    }
    .ant-menu-item {
      color: ${theme.colors.accent} !important;
      font-weight: 600 !important;
    }
    .ant-menu-item::after {
      border-bottom: none !important;
      transition: none !important;
    }
    .ant-menu-item-selected::after {
      border-bottom: none !important;
    }
    .ant-menu-item-selected {
      color: ${theme.colors.accent} !important;
    }
    .ant-menu-item:hover {
      color: ${theme.colors.accent} !important;
    }
  `;

  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = navStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [navStyles]);

  return (
    <>
      <Header style={{
        backgroundColor: theme.colors.primaryBg,
        display: 'flex',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        borderBottom: `1px solid ${theme.colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexGrow: 1 }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '900',
              cursor: 'pointer',
              letterSpacing: '2.5px',
              color: theme.colors.accent,
              textShadow: isDarkMode ? `0 0 18px ${theme.colors.accent}40` : 'none'
            }}
            onClick={() => navigate('/')}
          >
            HIRIX
          </div>
          <div style={{ flexGrow: 1 }}>
            <Menu
              mode="horizontal"
              overflowedIndicator={false}
              selectedKeys={getSelectedKey()}
              onClick={({ key }) => handleMenuClick(key)}
              style={{
                background: 'transparent',
                color: theme.colors.accent,
                fontWeight: 500,
                border: 'none',
              }}
              items={[
                { key: 'home', label: 'Home' },
                { key: 'jobs', label: 'Jobs' },
                { key: 'companies', label: 'Companies' },
                { key: 'Preparation', label: 'Preparation' },
                ...(isAuthenticated ? [{ key: 'dashboard', label: 'Dashboard' }] : [])
              ]}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            type="text"
            icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
            onClick={toggleTheme}
            style={{
              color: theme.colors.accent,
              fontSize: '18px'
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          />

          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            style={{
              width: 200,
              borderRadius: 8,
              background: isDarkMode ? '#f1fff0' : '#ffffff',
              border: `1px solid ${theme.colors.border}`
            }}
          />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: theme.colors.accent, fontWeight: 500 }}>
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
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.primaryBg,
                      fontWeight: 'bold'
                    }}
                  >
                    {getUserInitials(user?.name)}
                  </Avatar>
                  <DownOutlined style={{ color: theme.colors.accent, fontSize: 12 }} />
                </Space>
              </Dropdown>
            </div>
          ) : (
            <>
              <Button
                style={{
                  borderRadius: 20,
                  padding: '0 20px',
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.primaryBg,
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
                  color: theme.colors.accent,
                  border: `1px solid ${theme.colors.accent}`,
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

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={logoutModalVisible}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Yes, Logout"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: theme.colors.accent,
            color: theme.colors.primaryBg,
            border: 'none',
            fontWeight: 'bold'
          }
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: theme.colors.tertiaryBg,
            color: theme.colors.textPrimary,
            border: `1px solid ${theme.colors.border}`
          }
        }}
        styles={{
          content: {
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`
          },
          header: {
            backgroundColor: theme.colors.cardBg,
            borderBottom: `1px solid ${theme.colors.border}`
          },
          mask: {
            backgroundColor: theme.colors.modalOverlay
          }
        }}
      >
        <p style={{ color: theme.colors.textPrimary }}>Are you sure you want to logout?</p>
        <p style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>
          You will be redirected to the home page.
        </p>
      </Modal>
    </>
  );
};

export default Navbar;
