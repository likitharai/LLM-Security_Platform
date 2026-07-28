import api from './api';

export const policyService = {
  // Fetch active policies from backend
  getPolicies: async () => {
    const response = await api.get('/policies/');
    return response.data;
  },

  // Save updated policy toggles
  updatePolicies: async (policiesArray) => {
    const response = await api.put('/policies/', { policies: policiesArray });
    return response.data;
  }
};