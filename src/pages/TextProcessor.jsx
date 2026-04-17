import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Input, 
  message, 
  Row, 
  Col, 
  Space,
  Statistic,
  Divider,
  Tooltip
} from 'antd';
import { 
  CopyOutlined, 
  ClearOutlined, 
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  SwapOutlined,
  ScissorOutlined,
  FileTextOutlined,
  GlobalOutlined,
  TranslationOutlined,
  ColumnWidthOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const TextProcessor = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ charCount: 0, wordCount: 0, lineCount: 0 });

  const processText = async (action) => {
    if (!text.trim()) {
      message.warning('请输入文本内容');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/text/process', {
        text,
        action
      });
      
      if (response.data.code === 200) {
        setText(response.data.data.result);
        setStats(response.data.data.stats);
        message.success('处理成功');
      }
    } catch (err) {
      message.error('处理失败');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const clearText = () => {
    setText('');
    setStats({ charCount: 0, wordCount: 0, lineCount: 0 });
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    // 基础实时统计
    setStats({
      charCount: val.length,
      wordCount: val.trim() ? val.trim().split(/\s+/).length : 0,
      lineCount: val ? val.split('\n').length : 0
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>文本工具箱</Title>
        <Paragraph type="secondary">
          便捷的文本格式化与统计工具。支持大小写转换、去除空格、文本反转等。
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <TextArea
              value={text}
              onChange={handleTextChange}
              placeholder="请在这里输入或粘贴您的文本..."
              autoSize={{ minRows: 12, maxRows: 24 }}
              style={{ 
                fontSize: '16px', 
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #f0f0f0',
                background: '#fafafa'
              }}
            />
            
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Tooltip title="转换为大写">
                <Button icon={<VerticalAlignTopOutlined />} onClick={() => processText('upper')} loading={loading}>大写</Button>
              </Tooltip>
              <Tooltip title="转换为小写">
                <Button icon={<VerticalAlignBottomOutlined />} onClick={() => processText('lower')} loading={loading}>小写</Button>
              </Tooltip>
              <Tooltip title="反转文本">
                <Button icon={<SwapOutlined />} onClick={() => processText('reverse')} loading={loading}>反转</Button>
              </Tooltip>
              <Tooltip title="去除两端空格">
                <Button icon={<ScissorOutlined />} onClick={() => processText('trim')} loading={loading}>去空格</Button>
              </Tooltip>
              <Tooltip title="去除多余空格">
                <Button icon={<ColumnWidthOutlined />} onClick={() => processText('collapse')} loading={loading}>缩减空格</Button>
              </Tooltip>
              <Tooltip title="中键符号转英键">
                <Button icon={<GlobalOutlined />} onClick={() => processText('cnToEn')} loading={loading}>中转英符号</Button>
              </Tooltip>
              <Tooltip title="英键符号转中键">
                <Button icon={<TranslationOutlined />} onClick={() => processText('enToCn')} loading={loading}>英转中符号</Button>
              </Tooltip>
              
              <div style={{ flex: 1 }} />
              
              <Button danger icon={<ClearOutlined />} onClick={clearText}>清空</Button>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyToClipboard} disabled={!text}>复制结果</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <Title level={5}><FileTextOutlined style={{ marginRight: '8px' }} />文本统计</Title>
            <Divider style={{ margin: '12px 0' }} />
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Statistic title="字符数" value={stats.charCount} />
              <Statistic title="词数" value={stats.wordCount} />
              <Statistic title="行数" value={stats.lineCount} />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TextProcessor;
