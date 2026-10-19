import api from './api';

export const analyticsService = {
  async getDashboardMetrics() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  async getSalesTrend() {
    const response = await api.get('/analytics/sales-trend');
    return response.data;
  },

  async getPopularItems() {
    const response = await api.get('/analytics/popular-items');
    return response.data;
  },
};

export default analyticsService;
