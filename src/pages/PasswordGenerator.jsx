import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Slider, 
  Checkbox, 
  Input, 
  message, 
  Row, 
  Col, 
  Space,
  Divider,
  Alert
} from 'antd';
import { 
  CopyOutlined, 
  ReloadOutlined, 
  SecurityScanOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    number: true,
    symbol: false,
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePassword = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/password/generate', {
        params: {
          length,
          upper: options.upper,
          lower: options.lower,
          number: options.number,
          symbol: options.symbol
        }
      });
      
      if (response.data.code === 200) {
        setPassword(response.data.data.password);
      } else {
        setError(response.data);
      }
    } catch (err) {
      message.error('生成失败，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    message.success({
      content: '已成功复制到剪贴板！',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    });
  };

  const onOptionChange = (name) => (e) => {
    setOptions({ ...options, [name]: e.target.checked });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>安全密码生成器</Title>
        <Paragraph type="secondary">
          生成随机且复杂的密码，保护您的账户安全。所有操作均在服务器端安全完成。
        </Paragraph>
      </div>

      {error && (
        <Alert
          message="生成失败"
          description={error.message}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '24px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          border: '1px solid #f0f0f0',
          position: 'relative'
        }}>
          <Input 
            value={password} 
            readOnly 
            style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              fontFamily: 'monospace',
              paddingRight: '40px',
              border: 'none',
              background: 'transparent'
            }} 
          />
          <Space style={{ marginTop: '16px', width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={generatePassword} 
              loading={loading}
            >
              换一个
            </Button>
            <Button 
              type="primary" 
              icon={<CopyOutlined />} 
              onClick={copyToClipboard}
              disabled={!password}
            >
              复制密码
            </Button>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Text strong>密码长度: {length}</Text>
            <Slider 
              min={4} 
              max={64} 
              value={length} 
              onChange={setLength} 
              onAfterChange={generatePassword}
            />
          </Col>
          
          <Col span={24}>
            <Divider orientation="left" style={{ margin: '12px 0' }}>包含选项</Divider>
            <Row>
              <Col xs={12} sm={6}>
                <Checkbox checked={options.upper} onChange={onOptionChange('upper')}>大写字母</Checkbox>
              </Col>
              <Col xs={12} sm={6}>
                <Checkbox checked={options.lower} onChange={onOptionChange('lower')}>小写字母</Checkbox>
              </Col>
              <Col xs={12} sm={6}>
                <Checkbox checked={options.number} onChange={onOptionChange('number')}>数字</Checkbox>
              </Col>
              <Col xs={12} sm={6}>
                <Checkbox checked={options.symbol} onChange={onOptionChange('symbol')}>特殊符号</Checkbox>
              </Col>
            </Row>
          </Col>

          <Col span={24} style={{ marginTop: '16px' }}>
            <Button 
              type="primary" 
              size="large" 
              block 
              icon={<SecurityScanOutlined />} 
              onClick={generatePassword}
              loading={loading}
            >
              重新生成密码
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PasswordGenerator;
