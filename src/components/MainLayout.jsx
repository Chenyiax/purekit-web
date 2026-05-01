import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Drawer, Space, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  PictureOutlined, 
  MenuOutlined, 
  SecurityScanOutlined, 
  FileTextOutlined, 
  EditOutlined, 
  FilePdfOutlined, 
  FileImageOutlined, 
  DiffOutlined, 
  GithubOutlined 
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
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
    {
      key: '/text-diff',
      icon: <DiffOutlined />,
      label: <Link to="/text-diff" onClick={() => setDrawerVisible(false)}>文本差异对比</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header style={{ 
        position: 'fixed', 
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

      <Content style={{ 
        padding: isMobile ? '20px 16px' : '40px 50px',
        marginTop: '64px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#8c8c8c', padding: '24px 16px' }}>
        <div style={{ marginBottom: '8px' }}>
          PureKit ©{new Date().getFullYear()} Minimalist Utility Hub
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '14px',
          gap: '8px' 
        }}>
          <GithubOutlined style={{ fontSize: '18px' }} />
          <span>GitHub:</span>
          <a href="https://github.com/Chenyiax/purekit-web" target="_blank" rel="noopener noreferrer" style={{ color: '#8c8c8c' }}>Web</a>
          <a href="https://github.com/Chenyiax/purekit-backend" target="_blank" rel="noopener noreferrer" style={{ color: '#8c8c8c' }}>Backend</a>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
