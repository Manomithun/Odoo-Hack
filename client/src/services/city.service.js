import api from './api';

export const cityService = {
  getAll: (params) => api.get('/cities', { params }),
  getById: (id) => api.get(`/cities/${id}`),
  getActivities: (cityId, params) => api.get(`/cities/${cityId}/activities`, { params }),
  getSharedTrip: (token) => api.get(`/public/${token}`),
  getSaved: () => api.get('/saved'),
  save: (cityId) => api.post('/saved', { cityId }),
  unsave: (cityId) => api.delete(`/saved/${cityId}`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
};
