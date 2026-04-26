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
  Result
} from 'antd';
import { InboxOutlined, DownloadOutlined, FilePdfOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
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
        message.error('无法连接到后端服务，请检查服务器是否启动');
      }
    } finally {
      setConverting(false);
    }
  };

  const props = {
    onRemove: () => {
      setFileList([]);
      setResultZip(null);
      setBackendError(null);
    },
    beforeUpload: (file) => {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('只能上传 PDF 文件！');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      setResultZip(null);
      setBackendError(null);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: '.pdf'
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>PDF 转图片</Title>
        <Paragraph type="secondary">
          将 PDF 文件的每一页逐页转换为 PNG 图片，并打包成 ZIP 下载。
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
          <Col span={24}>
            <Dragger {...props} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon">
                <FilePdfOutlined style={{ color: '#ff4d4f' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽 PDF 文件到此区域</p>
              <p className="ant-upload-hint" style={{ fontSize: '12px' }}>单次支持一个 PDF 文件，自动转换为高质量图片包</p>
            </Dragger>
          </Col>

          <Col span={24} style={{ textAlign: 'center' }}>
            <Button 
              type="primary" 
              size="large"
              icon={<DownloadOutlined />} 
              onClick={handleUpload} 
              loading={converting}
              disabled={fileList.length === 0 || resultZip}
              style={{ height: '48px', padding: '0 32px', borderRadius: '8px' }}
            >
              {converting ? '正在处理...' : '开始转换'}
            </Button>
          </Col>

          {resultZip && (
            <Col span={24}>
              <Result
                status="success"
                title="转换完成！"
                subTitle="您的 PDF 已成功转换为图片包，点击下方按钮下载。"
                extra={[
                  <Button 
                    type="primary" 
                    key="download" 
                    icon={<DownloadOutlined />} 
                    onClick={downloadResult}
                    size="large"
                  >
                    下载图片包 (ZIP)
                  </Button>,
                  <Button 
                    key="again" 
                    onClick={() => {
                      setFileList([]);
                      setResultZip(null);
                    }}
                  >
                    再次转换
                  </Button>
                ]}
              />
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default PdfConverter;
