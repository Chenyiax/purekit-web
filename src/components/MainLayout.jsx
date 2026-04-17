import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, PictureOutlined, MenuOutlined, SecurityScanOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Use a simple media query check. Since I can't install new packages easily without potential policy issues, 
  // I'll use a standard window listener or just rely on CSS media queries for the toggle.
  // Actually, I'll use a state based on window width for a more robust "React way".
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/" onClick={() => setDrawerVisible(false)}>首页</Link>,
    },
    {
      key: '/image-converter',
      icon: <PictureOutlined />,
      label: <Link to="/image-converter" onClick={() => setDrawerVisible(false)}>图片转换</Link>,
    },
    {
      key: '/password-generator',
      icon: <SecurityScanOutlined />,
      label: <Link to="/password-generator" onClick={() => setDrawerVisible(false)}>密码生成</Link>,
    },
    {
      key: '/text-processor',
      icon: <FileTextOutlined />,
      label: <Link to="/text-processor" onClick={() => setDrawerVisible(false)}>文本处理</Link>,
    },
    {
      key: '/json-formatter',
      icon: <EditOutlined />,
      label: <Link to="/json-formatter" onClick={() => setDrawerVisible(false)}>JSON 格式化</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: isMobile ? '0 20px' : '0 50px',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff', fontSize: isMobile ? '18px' : '22px' }}>
            PureKit
          </Title>
        </div>

        {isMobile ? (
          <>
            <Button 
              type="text" 
              icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
              onClick={() => setDrawerVisible(true)} 
            />
            <Drawer
              title="菜单"
              placement="right"
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              width={250}
            >
              <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ border: 'none' }}
              />
            </Drawer>
          </>
        ) : (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ flex: 1, border: 'none', justifyContent: 'flex-end', minWidth: 0 }}
          />
        )}
      </Header>

      <Content style={{ padding: isMobile ? '20px 16px' : '40px 50px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#8c8c8c', padding: '24px 16px' }}>
        PureKit ©{new Date().getFullYear()} Minimalist Utility Hub
      </Footer>
    </Layout>
  );
};

export default MainLayout;
