import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PictureOutlined, SecurityScanOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const tools = [
  {
    title: '图片转换',
    description: '快速将图片转换为各种常见格式 (JPG, PNG, WebP等)',
    icon: <PictureOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    path: '/image-converter',
  },
  {
    title: '密码生成',
    description: '安全可靠的随机密码生成器',
    icon: <SecurityScanOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
    path: '/password-generator',
    disabled: false,
  },
  {
    title: '文本处理',
    description: '大小写转换、中英文符号转换等基础文本工具',
    icon: <FileTextOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
    path: '/text-processor',
    disabled: false,
  },
  {
    title: 'JSON 格式化',
    description: '一键整理、校验、压缩和转义 JSON 数据',
    icon: <EditOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
    path: '/json-formatter',
    disabled: false,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '40px', marginTop: '10px' }}>
        <Title level={2} style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}>简约高效的工具集合</Title>
        <Paragraph type="secondary" style={{ fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
          PureKit 旨在为您提供最纯粹的在线工具体验，无广告，无追踪。
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {tools.map((tool, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '12px', 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                opacity: tool.disabled ? 0.6 : 1,
                cursor: tool.disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column'
              }}
              bodyStyle={{ flex: 1, padding: '24px' }}
              onClick={() => !tool.disabled && navigate(tool.path)}
            >
              <div style={{ marginBottom: '16px' }}>{tool.icon}</div>
              <Title level={4} style={{ marginBottom: '8px' }}>{tool.title}</Title>
              <Paragraph type="secondary" style={{ marginBottom: '0' }}>{tool.description}</Paragraph>
              {tool.disabled && (
                <div style={{ color: '#bfbfbf', fontSize: '12px', marginTop: '12px' }}>敬请期待</div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
