import api from './api';

export const inventoryService = {
  async getInventory(params = {}) {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  async createItem(itemData) {
    const response = await api.post('/inventory', itemData);
    return response.data;
  },

  async adjustStock(itemId, quantityChange, reason = 'Manual Restock') {
    const response = await api.patch(`/inventory/${itemId}/adjust`, {
      quantity_change: quantityChange,
      reason,
    });
    return response.data;
  },

  async deleteItem(itemId) {
    await api.delete(`/inventory/${itemId}`);
  },
};

export default inventoryService;
