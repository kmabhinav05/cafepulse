import api from './api';

export const menuService = {
  // 1. Categories
  async getCategories(includeInactive = false) {
    const response = await api.get('/menu/categories', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await api.post('/menu/categories', categoryData);
    return response.data;
  },

  async updateCategory(categoryId, categoryData) {
    const response = await api.put(`/menu/categories/${categoryId}`, categoryData);
    return response.data;
  },

  async deleteCategory(categoryId) {
    await api.delete(`/menu/categories/${categoryId}`);
  },

  // 2. Menu Items
  async getMenuItems(params = {}) {
    const response = await api.get('/menu/items', { params });
    return response.data;
  },

  async getMenuItem(itemId) {
    const response = await api.get(`/menu/items/${itemId}`);
    return response.data;
  },

  async createMenuItem(itemData) {
    const response = await api.post('/menu/items', itemData);
    return response.data;
  },

  async updateMenuItem(itemId, itemData) {
    const response = await api.put(`/menu/items/${itemId}`, itemData);
    return response.data;
  },

  async toggleItemAvailability(itemId) {
    const response = await api.patch(`/menu/items/${itemId}/toggle-availability`);
    return response.data;
  },

  async deleteMenuItem(itemId) {
    await api.delete(`/menu/items/${itemId}`);
  },

  // 3. Modifier Groups
  async getModifierGroups() {
    const response = await api.get('/menu/modifiers');
    return response.data;
  },

  async createModifierGroup(groupData) {
    const response = await api.post('/menu/modifiers', groupData);
    return response.data;
  },
};

export default menuService;
