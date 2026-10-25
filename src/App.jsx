import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BackendStatusProvider } from './context/BackendStatusContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import CropGuidance from './pages/CropGuidance';
import ModelPerformance from './pages/ModelPerformance';
import AboutProject from './pages/AboutProject';

function App() {
  return (
    <BackendStatusProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="detect" element={<DiseaseDetection />} />
            <Route path="guidance" element={<CropGuidance />} />
            <Route path="performance" element={<ModelPerformance />} />
            <Route path="about" element={<AboutProject />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BackendStatusProvider>
  );
}

export default App;
