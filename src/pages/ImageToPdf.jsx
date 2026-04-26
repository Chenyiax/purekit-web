import React, { useState } from 'react';
import { 
  Typography, 
  Upload, 
  message, 
  Card, 
  Button, 
  Row, 
  Col, 
  Alert,
  Result
} from 'antd';
import { DownloadOutlined, FileImageOutlined, ExclamationCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

const ImageToPdf = () => {
  const [fileList, setFileList] = useState([]);
  const [converting, setConverting] = useState(false);
  const [resultPdf, setResultPdf] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先上传图片文件');
      return;
    }

    setBackendError(null);
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('images', file.originFileObj || file);
    });

    setConverting(true);
    try {
      const response = await axios.post('/api/pdf/images-to-pdf', formData, {
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
        setResultPdf(url);
        message.success('转换成功！所有图片已合并为 PDF。');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      message.error('转换过程中发生错误，请重试');
    } finally {
      setConverting(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setResultPdf(null);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return Upload.LIST_IGNORE;
      }
      setFileList([...fileList, file]);
      setResultPdf(null);
      setBackendError(null);
      return false;
    },
    fileList,
    multiple: true,
    accept: 'image/*'
  };

  const downloadResult = () => {
    if (!resultPdf) return;
    const link = document.createElement('a');
    link.href = resultPdf;
    link.setAttribute('download', `purekit_images_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>图片转 PDF</Title>
        <Paragraph type="secondary">
          将一张或多张图片按顺序合并为一个 PDF 文件。支持 JPG, PNG, WebP 等常见格式。
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
                <FileImageOutlined style={{ color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽多张图片到此区域</p>
              <p className="ant-upload-hint" style={{ fontSize: '12px' }}>支持多选上传，图片将按上传顺序排列在 PDF 页面中</p>
            </Dragger>
          </Col>

          {fileList.length > 0 && !resultPdf && (
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                icon={<FilePdfOutlined />} 
                onClick={handleUpload} 
                loading={converting}
                style={{ height: '48px', padding: '0 32px', borderRadius: '8px' }}
              >
                {converting ? '正在合并...' : `合并 ${fileList.length} 张图片并生成 PDF`}
              </Button>
            </Col>
          )}

          {resultPdf && (
            <Col span={24}>
              <Result
                status="success"
                title="合并完成！"
                subTitle="您的图片已成功合并为 PDF 文件，点击下方按钮下载。"
                extra={[
                  <Button 
                    type="primary" 
                    key="download" 
                    icon={<DownloadOutlined />} 
                    onClick={downloadResult}
                    size="large"
                  >
                    下载 PDF 文件
                  </Button>,
                  <Button 
                    key="again" 
                    onClick={() => {
                      setFileList([]);
                      setResultPdf(null);
                    }}
                  >
                    继续转换
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

export default ImageToPdf;
