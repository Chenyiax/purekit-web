import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import ImageConverter from './pages/ImageConverter';
import PdfConverter from './pages/PdfConverter';
import ImageToPdf from './pages/ImageToPdf';
import PasswordGenerator from './pages/PasswordGenerator';
import TextProcessor from './pages/TextProcessor';
import JsonFormatter from './pages/JsonFormatter';
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/pdf-converter" element={<PdfConverter />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/text-processor" element={<TextProcessor />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
