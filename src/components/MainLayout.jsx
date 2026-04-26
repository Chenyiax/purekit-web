import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, PictureOutlined, MenuOutlined, SecurityScanOutlined, FileTextOutlined, EditOutlined, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons';

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
      key: '/pdf-converter',
      icon: <FilePdfOutlined />,
      label: <Link to="/pdf-converter" onClick={() => setDrawerVisible(false)}>PDF 转图片</Link>,
    },
    {
      key: '/image-to-pdf',
      icon: <FileImageOutlined />,
      label: <Link to="/image-to-pdf" onClick={() => setDrawerVisible(false)}>图片转 PDF</Link>,
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
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        padding: isMobile ? '0 24px' : '0 60px',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={4} className="logo-text" style={{ margin: 0, fontSize: isMobile ? '26px' : '34px' }}>
              Pure<span style={{ fontWeight: 400 }}>Kit</span><span className="logo-dot">.</span>
            </Title>
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button 
              type="text" 
              icon={<MenuOutlined style={{ fontSize: '20px', color: '#1890ff' }} />} 
              onClick={() => setDrawerVisible(true)} 
            />
            <Drawer
              title={<span className="logo-text">PureKit 菜单</span>}
              placement="right"
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              width={260}
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
            className="custom-menu"
            style={{ flex: 1, border: 'none', justifyContent: 'flex-end', minWidth: 0, marginLeft: '24px' }}
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
