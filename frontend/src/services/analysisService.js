import api from './api';

export const analysisService = {
  // Post prompt for analysis
  analyzePrompt: async (promptData) => {
    const response = await api.post('/analysis/analyze', promptData);
    return response.data;
  },

  // Fetch threat logs for audit trail
  getThreatLogs: async (limit = 50) => {
    const response = await api.get(`/logs/logs?limit=${limit}`);
    return response.data;
  }
};