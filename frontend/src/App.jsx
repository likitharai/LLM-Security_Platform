import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import PromptAnalyzer from './pages/PromptAnalyzer';
import AnalysisHistory from './pages/AnalysisHistory';
import PolicyManagement from './pages/PolicyManagement';
import ModelHealth from './pages/ModelHealth'; // Assuming you kept this from earlier

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Default route redirects to Overview/Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analyze" element={<PromptAnalyzer />} />
          <Route path="logs" element={<AnalysisHistory />} />
          <Route path="policies" element={<PolicyManagement />} />
          <Route path="health" element={<ModelHealth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}