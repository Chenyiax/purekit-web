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
  Alert,
  Slider,
  List,
  Result,
  Space
} from 'antd';
import { 
  InboxOutlined, 
  DownloadOutlined, 
  SwapOutlined, 
  ExclamationCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
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
    const fileToUpload = fileList[0].originFileObj || fileList[0];
    formData.append('image', fileToUpload);

    setConverting(true);
    try {
      const response = await axios.post(`/api/image/convert?format=${targetFormat}&quality=${quality}`, formData, {
        responseType: 'blob'
      });

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
        message.error('无法连接到后端服务，请检查网络');
      }
    } finally {
      setConverting(false);
    }
  };

  const removeFile = () => {
    setFileList([]);
    setResultImage(null);
    setBackendError(null);
  };

  const uploadProps = {
    multiple: false,
    maxCount: 1,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
      if (!isImage) {
        message.error('只能上传图片文件！');
        return Upload.LIST_IGNORE;
      }
      file.preview = URL.createObjectURL(file);
      setFileList([file]);
      setResultImage(null);
      setBackendError(null);
      return false;
    }
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
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: (fileList.length > 0 && !resultImage) ? '160px' : '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3}>图片格式转换</Title>
        <Paragraph type="secondary">
          将您的图片上传并转换为指定格式。支持 JPEG, PNG, WebP 等主流格式。
        </Paragraph>
      </div>

      {backendError && (
        <Alert
          message="转换错误"
          description={backendError.message}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '20px', borderRadius: '8px' }}
          closable
          onClose={() => setBackendError(null)}
        />
      )}

      {!resultImage ? (
        <>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Dragger {...uploadProps} style={{ padding: '20px', background: '#fafafa' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽图片到此区域</p>
              <p className="ant-upload-hint" style={{ fontSize: '12px' }}>单张限制 10MB</p>
            </Dragger>

            {fileList.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Text strong>已选图片</Text>
                <List
                  itemLayout="horizontal"
                  dataSource={fileList}
                  style={{ border: '1px solid #f0f0f0', borderRadius: '8px', marginTop: '8px' }}
                  renderItem={(file) => (
                    <List.Item
                      style={{ padding: '8px 12px' }}
                      actions={[
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={removeFile} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <img 
                            src={file.preview} 
                            alt="preview" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                        }
                        title={<Text ellipsis style={{ maxWidth: '200px' }}>{file.name}</Text>}
                        description={(file.size / 1024).toFixed(2) + ' KB'}
                      />
                    </List.Item>
                  )}
                />

                <div style={{ marginTop: '24px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} sm={12}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>目标格式</Text>
                        <Select 
                          value={targetFormat} 
                          style={{ width: '100%' }} 
                          onChange={setTargetFormat}
                        >
                          {formats.map(fmt => (
                            <Option key={fmt} value={fmt}>{fmt.toUpperCase()}</Option>
                          ))}
                        </Select>
                      </Space>
                    </Col>
                    
                    {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                      <Col xs={24} sm={12}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>转换质量 ({quality})</Text>
                          <Slider 
                            min={1} 
                            max={100} 
                            value={quality} 
                            onChange={setQuality} 
                          />
                        </Space>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            )}
          </Card>

          {fileList.length > 0 && (
            <div style={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              background: '#fff', 
              padding: '16px 24px', 
              boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button 
                type="primary" 
                size="large"
                icon={<SwapOutlined />} 
                onClick={handleUpload} 
                loading={converting}
                style={{ 
                  width: '100%',
                  maxWidth: '500px',
                  height: '48px', 
                  borderRadius: '24px',
                  fontSize: '16px'
                }}
              >
                {converting ? '正在处理...' : `转换为 ${targetFormat.toUpperCase()}`}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card bordered={false} style={{ borderRadius: '12px', textAlign: 'center' }}>
          <Result
            status="success"
            title="转换成功！"
            subTitle="您的图片已成功转换，点击下方按钮下载。"
            extra={[
              <div key="result-img" style={{ marginBottom: '24px' }}>
                <Image
                  width={200}
                  src={resultImage}
                  style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
              </div>,
              <Space key="result-actions">
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={downloadResult}
                  size="large"
                  style={{ borderRadius: '24px', padding: '0 32px' }}
                >
                  下载结果
                </Button>
                <Button 
                  onClick={() => {
                    setFileList([]);
                    setResultImage(null);
                  }}
                  style={{ borderRadius: '24px' }}
                >
                  再次转换
                </Button>
              </Space>
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default ImageConverter;
