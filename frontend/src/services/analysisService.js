import api from './api';

export const analysisService = {
  analyzePrompt: async (promptData) => {
    const response = await api.post('/analysis/analyze', promptData);
    return response.data;
  },

  getHistory: async (params) => {
    const response = await api.get('/analysis/history', { params });
    return response.data;
  },

  getAnalysisDetails: async (id) => {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  }
};