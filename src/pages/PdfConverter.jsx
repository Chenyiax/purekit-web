import React, { useState } from 'react';
import { 
  Typography, 
  Upload, 
  message, 
  Card, 
  Button, 
  Row, 
  Col, 
  Space,
  Alert,
  Result,
  List
} from 'antd';
import { 
  InboxOutlined, 
  DownloadOutlined, 
  FilePdfOutlined, 
  ExclamationCircleOutlined, 
  SwapOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

const PdfConverter = () => {
  const [fileList, setFileList] = useState([]);
  const [converting, setConverting] = useState(false);
  const [resultZip, setResultZip] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先上传 PDF 文件');
      return;
    }

    setBackendError(null);
    const formData = new FormData();
    const fileToUpload = fileList[0].originFileObj || fileList[0];
    formData.append('pdf', fileToUpload);

    setConverting(true);
    try {
      const response = await axios.post('/api/pdf/convert', formData, {
        responseType: 'blob'
      });

      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        setBackendError(errorData);
        message.error(`转换失败: ${errorData.message || '未知错误'}`);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResultZip(url);
        message.success('转换成功！所有页面已转换为图片。');
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
    setResultZip(null);
    setBackendError(null);
  };

  const uploadProps = {
    multiple: false,
    maxCount: 1,
    accept: '.pdf',
    showUploadList: false,
    beforeUpload: (file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        message.error('只能上传 PDF 文件！');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      setResultZip(null);
      setBackendError(null);
      return false;
    }
  };

  const downloadResult = () => {
    if (!resultZip) return;
    const link = document.createElement('a');
    link.href = resultZip;
    link.setAttribute('download', `purekit_pdf_images_${Date.now()}.zip`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: (fileList.length > 0 && !resultZip) ? '120px' : '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3}>PDF 转图片</Title>
        <Paragraph type="secondary">
          将 PDF 文件的每一页逐页转换为 PNG 图片，并打包成 ZIP 下载。
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

      {!resultZip ? (
        <>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Dragger {...uploadProps} style={{ padding: '20px', background: '#fafafa' }}>
              <p className="ant-upload-drag-icon">
                <FilePdfOutlined style={{ color: '#ff4d4f' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽 PDF 到此区域</p>
              <p className="ant-upload-hint" style={{ fontSize: '12px' }}>单张限制 50MB</p>
            </Dragger>

            {fileList.length > 0 && (
              <div style={{ marginTop: '32px' }}> {/* 适当下调：增加了间距 */}
                <Text strong>已选文件</Text>
                <List
                  itemLayout="horizontal"
                  dataSource={fileList}
                  style={{ border: '1px solid #f0f0f0', borderRadius: '8px', marginTop: '12px' }}
                  renderItem={(file) => (
                    <List.Item
                      style={{ padding: '12px' }}
                      actions={[
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={removeFile} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FilePdfOutlined style={{ fontSize: '32px', color: '#ff4d4f' }} />}
                        title={<Text ellipsis style={{ maxWidth: '250px' }}>{file.name}</Text>}
                        description={(file.size / 1024 / 1024).toFixed(2) + ' MB'}
                      />
                    </List.Item>
                  )}
                />
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
                {converting ? '正在处理...' : '开始转换'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card bordered={false} style={{ borderRadius: '12px', textAlign: 'center' }}>
          <Result
            status="success"
            title="转换完成！"
            subTitle="您的 PDF 已成功转换为图片包，请点击下方按钮下载。"
            extra={[
              <Space key="result-actions" direction="vertical" style={{ width: '100%' }} size="large">
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={downloadResult}
                  size="large"
                  style={{ borderRadius: '24px', padding: '0 40px' }}
                >
                  下载 ZIP 压缩包
                </Button>
                <Button 
                  onClick={() => {
                    setFileList([]);
                    setResultZip(null);
                  }}
                  style={{ borderRadius: '24px' }}
                >
                  转换另一个文件
                </Button>
              </Space>
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default PdfConverter;
