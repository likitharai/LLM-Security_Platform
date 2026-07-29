import api from './api';

export const dashboardService = {
  getOverviewStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getThreatTrends: async (timeframe = '24h') => {
    const response = await api.get(`/dashboard/threat-trends?timeframe=${timeframe}`);
    return response.data;
  },

  getRiskDistribution: async () => {
    const response = await api.get('/dashboard/risk-distribution');
    return response.data;
  }
};