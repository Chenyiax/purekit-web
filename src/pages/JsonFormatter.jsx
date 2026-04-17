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
  Alert,
  Tooltip,
  Divider
} from 'antd';
import { 
  CopyOutlined, 
  ClearOutlined, 
  FormatPainterOutlined,
  CompressOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const JsonFormatter = () => {
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormat = async (action = 'format', indent = true) => {
    if (!jsonData.trim()) {
      message.warning('请输入内容');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/json/format', {
        data: jsonData,
        indent: indent,
        action: action
      });
      
      if (response.data.code === 200) {
        setJsonData(response.data.data.result);
        message.success('处理成功');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        message.error('请求失败，请检查后端服务');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!jsonData) return;
    navigator.clipboard.writeText(jsonData);
    message.success('已复制到剪贴板');
  };

  const clearContent = () => {
    setJsonData('');
    setError(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>JSON 工具箱</Title>
        <Paragraph type="secondary">
          一键整理、校验、压缩及转义 JSON 数据。
        </Paragraph>
      </div>

      {error && (
        <Alert
          message="处理失败"
          description={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '20px', borderRadius: '8px' }}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TextArea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder="请在这里粘贴您的 JSON 数据或转义字符串..."
          autoSize={{ minRows: 15, maxRows: 30 }}
          style={{ 
            fontSize: '14px', 
            fontFamily: 'monospace',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #f0f0f0',
            background: '#fafafa'
          }}
        />
        
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Button 
            type="primary" 
            icon={<FormatPainterOutlined />} 
            onClick={() => handleFormat('format', true)} 
            loading={loading}
          >
            美化格式
          </Button>
          <Button 
            icon={<CompressOutlined />} 
            onClick={() => handleFormat('format', false)} 
            loading={loading}
          >
            压缩 JSON
          </Button>
          <Button 
            icon={<LinkOutlined />} 
            onClick={() => handleFormat('escape')} 
            loading={loading}
          >
            JSON 转义
          </Button>
          <Button 
            icon={<DisconnectOutlined />} 
            onClick={() => handleFormat('unescape')} 
            loading={loading}
          >
            JSON 去转义
          </Button>
          <Divider type="vertical" style={{ height: '32px' }} />
          <Button 
            icon={<CopyOutlined />} 
            onClick={copyToClipboard} 
            disabled={!jsonData}
          >
            复制结果
          </Button>
          <Button 
            danger 
            icon={<ClearOutlined />} 
            onClick={clearContent}
          >
            清空
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JsonFormatter;
