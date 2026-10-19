import api from './api';

export const orderService = {
  // Public & Staff: Place new order
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Staff: List orders for Kitchen Display / POS
  async getOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Details
  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Public: Live customer tracker
  async trackOrder(orderNumber) {
    const response = await api.get(`/orders/track/${orderNumber}`);
    return response.data;
  },

  // Staff: Advance kitchen status
  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export default orderService;
