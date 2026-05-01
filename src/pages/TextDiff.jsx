import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Input, 
  Button, 
  Row, 
  Col, 
  Space, 
  Switch, 
  Empty
} from 'antd';
import { 
  SwapOutlined, 
  DeleteOutlined, 
  DiffOutlined, 
  FileTextOutlined,
  ArrowsAltOutlined
} from '@ant-design/icons';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const TextDiff = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [splitView, setSplitView] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCompare = () => {
    if (!oldText && !newText) return;
    setShowDiff(true);
  };

  const handleClear = () => {
    setOldText('');
    setNewText('');
    setShowDiff(false);
  };

  const handleSwap = () => {
    setOldText(newText);
    setNewText(oldText);
  };

  const loadSample = () => {
    setOldText("PureKit 是一个极简、纯粹的在线工具箱。\n它支持图片转换、PDF处理等功能。\n目前正在开发文本对比工具。");
    setNewText("PureKit 是一个极简、专业且纯粹的在线工具箱。\n它支持图片转换、PDF处理以及代码工具。\n目前文本对比工具已经上线了！");
    setShowDiff(true);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3}>文本差异对比</Title>
        <Paragraph type="secondary">
          对比两段文本的细微差别，支持代码和普通文本。支持并排和行内两种模式。
        </Paragraph>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong><FileTextOutlined /> 原始文本 (Old)</Text>
            </div>
            <TextArea 
              rows={8} 
              value={oldText} 
              onChange={(e) => setOldText(e.target.value)} 
              placeholder="请在此处粘贴原始内容..."
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong><DiffOutlined /> 修改后的文本 (New)</Text>
            </div>
            <TextArea 
              rows={8} 
              value={newText} 
              onChange={(e) => setNewText(e.target.value)} 
              placeholder="请在此处粘贴修改后的内容..."
              style={{ borderRadius: '8px' }}
            />
          </Col>
        </Row>

        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px' 
        }}>
          <Space wrap size={[8, 12]} style={{ width: isMobile ? '100%' : 'auto' }}>
            <Button 
              type="primary" 
              icon={<SwapOutlined />} 
              onClick={handleCompare}
              disabled={!oldText && !newText}
            >
              开始对比
            </Button>
            <Button icon={<ArrowsAltOutlined />} onClick={handleSwap}>交换左右</Button>
            <Button icon={<DeleteOutlined />} onClick={handleClear} danger>清空</Button>
            <Button type="link" onClick={loadSample} style={{ padding: isMobile ? '4px 0' : undefined }}>加载示例数据</Button>
          </Space>
          
          {!isMobile && (
            <Space style={{ marginLeft: 'auto' }}>
              <Text type="secondary">并排查看</Text>
              <Switch checked={splitView} onChange={setSplitView} size="small" />
            </Space>
          )}
        </div>
      </Card>

      {showDiff ? (
        <Card 
          bordered={false} 
          title="差异详情" 
          style={{ borderRadius: '12px', overflow: 'hidden' }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ fontSize: '14px', backgroundColor: '#fff', overflowX: 'auto' }}>
            <ReactDiffViewer
              oldValue={oldText}
              newValue={newText}
              splitView={splitView && !isMobile} // 手机端强制进入行内模式，体验更好
              compareMethod={DiffMethod.WORDS}
              styles={{
                variables: {
                  diffViewerBackground: '#fff',
                  addedBackground: '#e6fffa',
                  addedColor: '#069068',
                  removedBackground: '#fff1f0',
                  removedColor: '#cf1322',
                  wordAddedBackground: '#36cfc9',
                  wordRemovedBackground: '#ff7875',
                },
                contentText: {
                  fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                  lineHeight: '24px',
                  fontSize: isMobile ? '12px' : '14px'
                }
              }}
              leftTitle="原始内容"
              rightTitle="修改内容"
            />
          </div>
        </Card>
      ) : (
        <Card bordered={false} style={{ borderRadius: '12px', padding: '40px 0', textAlign: 'center' }}>
          <Empty description="输入文本后点击“开始对比”查看结果" />
        </Card>
      )}
    </div>
  );
};

export default TextDiff;
