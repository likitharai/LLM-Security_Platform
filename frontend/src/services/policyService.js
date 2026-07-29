import api from './api';

export const policyService = {
  getPolicies: async () => {
    const response = await api.get('/policies');
    return response.data;
  },

  togglePolicy: async (policyId, enabled) => {
    const response = await api.patch(`/policies/${policyId}`, { enabled });
    return response.data;
  },

  updatePolicy: async (policyId, data) => {
    const response = await api.put(`/policies/${policyId}`, data);
    return response.data;
  }
};