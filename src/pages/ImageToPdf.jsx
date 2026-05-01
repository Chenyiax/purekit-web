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
  Result,
  List,
  Space
} from 'antd';
import { 
  DownloadOutlined, 
  FileImageOutlined, 
  ExclamationCircleOutlined, 
  FilePdfOutlined,
  DeleteOutlined
} from '@ant-design/icons';
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
      const fileToUpload = file.originFileObj || file;
      if (fileToUpload instanceof File || fileToUpload instanceof Blob) {
        formData.append('images', fileToUpload);
      }
    });

    setConverting(true);
    try {
      const response = await axios.post('/api/pdf/images-to-pdf', formData, {
        responseType: 'blob'
      });

      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        setBackendError(errorData);
        message.error(`转换失败: ${errorData.message || '未知错误'}`);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResultPdf(url);
        message.success('转换成功！');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      message.error('转换过程中发生错误，请重试');
    } finally {
      setConverting(false);
    }
  };

  const removeFile = (uid) => {
    setFileList(prev => prev.filter(item => item.uid !== uid));
    setResultPdf(null);
  };

  const uploadProps = {
    multiple: true,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
      if (!isImage) {
        message.error(`${file.name} 格式不支持`);
        return Upload.LIST_IGNORE;
      }
      file.preview = URL.createObjectURL(file);
      setFileList(prev => [...prev, file]);
      setResultPdf(null);
      return false;
    }
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
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: fileList.length > 0 ? '100px' : '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3}>图片转 PDF</Title>
        <Paragraph type="secondary">
          支持多图合并。图片将按上传顺序排列。
        </Paragraph>
      </div>

      {backendError && (
        <Alert
          message="转换错误"
          description={backendError.message}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
          closable
        />
      )}

      {!resultPdf ? (
        <>
          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Dragger {...uploadProps} style={{ padding: '20px', background: '#fafafa' }}>
              <p className="ant-upload-drag-icon"><FileImageOutlined /></p>
              <p className="ant-upload-text">点击或拖拽图片</p>
              <p className="ant-upload-hint">支持多选，单张最大 10MB</p>
            </Dragger>

            {fileList.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <Text strong>已选图片 ({fileList.length})</Text>
                  <Button type="link" danger onClick={() => setFileList([])}>清空全部</Button>
                </div>
                
                <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={fileList}
                    renderItem={(file, index) => (
                      <List.Item
                        style={{ padding: '8px 12px' }}
                        actions={[
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => removeFile(file.uid)} 
                          />
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
                          title={<Text ellipsis style={{ maxWidth: '180px' }}>{file.name}</Text>}
                          description={`#${index + 1}`}
                        />
                      </List.Item>
                    )}
                  />
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
                icon={<FilePdfOutlined />} 
                onClick={handleUpload} 
                loading={converting}
                style={{ 
                  width: '100%',
                  maxWidth: '500px',
                  height: '48px', 
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {converting ? '正在合并图片...' : `立即合并 ${fileList.length} 张图片`}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card bordered={false} style={{ borderRadius: '12px', textAlign: 'center', padding: '24px 0' }}>
          <Result
            status="success"
            title="PDF 生成成功"
            subTitle="您可以点击下方按钮下载合并后的文件"
            extra={[
              <Button type="primary" key="dl" icon={<DownloadOutlined />} onClick={downloadResult} size="large">
                下载 PDF
              </Button>,
              <Button key="re" onClick={() => {setResultPdf(null); setFileList([]);}}>
                重新转换
              </Button>
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default ImageToPdf;
