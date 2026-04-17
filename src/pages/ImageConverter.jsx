import React, { useState } from 'react';
import { 
  Typography, 
  Upload, 
  message, 
  Card, 
  Select, 
  Button, 
  Row, 
  Col, 
  Image,
  Space,
  Alert,
  Slider
} from 'antd';
import { InboxOutlined, DownloadOutlined, SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const ImageConverter = () => {
  const [fileList, setFileList] = useState([]);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(85);
  const [converting, setConverting] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const formats = ['png', 'jpeg', 'webp', 'bmp', 'gif'];

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先上传图片');
      return;
    }

    setBackendError(null);
    const formData = new FormData();
    
    // 修复：兼容 antd 的不同文件包装格式
    const fileToUpload = fileList[0].originFileObj || fileList[0];
    formData.append('image', fileToUpload);

    setConverting(true);
    try {
      // 使用动态质量参数
      const response = await axios.post(`/api/image/convert?format=${targetFormat}&quality=${quality}`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 检查返回的是否真的是图片 (如果是 JSON 错误，axios 也会因为 responseType: 'blob' 把它转成 blob)
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        setBackendError(errorData);
        message.error(`转换失败: ${errorData.message || '未知错误'}`);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResultImage(url);
        message.success('转换成功！');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          setBackendError(errorData);
          message.error(`转换失败: ${errorData.message}`);
        } catch (e) {
          message.error('转换过程中发生错误，请重试');
        }
      } else {
        message.error('无法连接到后端服务，请检查服务器是否启动');
      }
    } finally {
      setConverting(false);
    }
  };

  const props = {
    onRemove: () => {
      setFileList([]);
      setResultImage(null);
      setBackendError(null);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      setResultImage(null);
      setBackendError(null);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: 'image/*'
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.setAttribute('download', `purekit_${Date.now()}.${targetFormat}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>图片格式转换</Title>
        <Paragraph type="secondary">
          将您的图片上传并转换为指定格式。支持 JPEG, PNG, WebP 等主流格式。
        </Paragraph>
      </div>

      {backendError && (
        <Alert
          message="后端错误"
          description={
            <div>
              <Text strong>错误代码: </Text> <Text code>{backendError.code}</Text> <br />
              <Text strong>错误消息: </Text> {backendError.message}
            </div>
          }
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '20px', borderRadius: '8px' }}
          closable
          onClose={() => setBackendError(null)}
        />
      )}

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Row gutter={[24, 24]}>
          <Col span={24} style={{ marginBottom: '16px' }}>
            <Dragger {...props} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽图片到此区域</p>
              <p className="ant-upload-hint" style={{ fontSize: '12px' }}>单次支持一张图片，大小限制5MB</p>
            </Dragger>
          </Col>

          <Col span={24}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              padding: '0 20px'
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth < 576 ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '12px', whiteSpace: 'nowrap' }}>目标格式:</span>
                  <Select 
                    defaultValue="png" 
                    style={{ width: 120 }} 
                    onChange={(val) => setTargetFormat(val)}
                  >
                    {formats.map(fmt => (
                      <Option key={fmt} value={fmt}>{fmt.toUpperCase()}</Option>
                    ))}
                  </Select>
                </div>
                
                {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: window.innerWidth < 576 ? '100%' : '300px',
                    marginLeft: window.innerWidth < 576 ? 0 : '24px'
                  }}>
                    <span style={{ marginRight: '12px', whiteSpace: 'nowrap' }}>图片质量:</span>
                    <Slider 
                      min={1} 
                      max={100} 
                      value={quality} 
                      onChange={setQuality} 
                      style={{ flex: 1 }}
                    />
                    <span style={{ marginLeft: '12px', width: '30px' }}>{quality}</span>
                  </div>
                )}

                <Button 
                  type="primary" 
                  icon={<SwapOutlined />} 
                  onClick={handleUpload} 
                  loading={converting}
                  disabled={fileList.length === 0}
                  block={window.innerWidth < 576}
                  style={{ height: '40px', marginLeft: (window.innerWidth >= 576 && !(targetFormat === 'jpeg' || targetFormat === 'webp')) ? '16px' : 0 }}
                >
                  立即转换
                </Button>
              </div>
            </div>
          </Col>

          {resultImage && (
            <Col span={24} style={{ textAlign: 'center', marginTop: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
              <Title level={4} style={{ marginBottom: '16px' }}>转换结果</Title>
              <div style={{ marginBottom: '24px' }}>
                <Image
                  maxWidth={400}
                  src={resultImage}
                  style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', objectFit: 'contain' }}
                />
              </div>
              <Button 
                type="primary" 
                ghost 
                icon={<DownloadOutlined />} 
                onClick={downloadResult}
                block={window.innerWidth < 576}
              >
                下载转换后的图片
              </Button>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default ImageConverter;
