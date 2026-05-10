import api from './api';

export const tripService = {
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  addStop: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  reorderStops: (tripId, stops) => api.put(`/trips/${tripId}/stops/reorder`, { stops }),
  getBudget: (tripId) => api.get(`/trips/${tripId}/budget`),
  addBudget: (tripId, data) => api.post(`/trips/${tripId}/budget`, data),
  deleteBudget: (id) => api.delete(`/budget/${id}`),
  getPacking: (tripId) => api.get(`/trips/${tripId}/packing`),
  addPackingItem: (tripId, data) => api.post(`/trips/${tripId}/packing`, data),
  updatePackingItem: (id, data) => api.put(`/packing/${id}`, data),
  deletePackingItem: (id) => api.delete(`/packing/${id}`),
  getNotes: (tripId) => api.get(`/trips/${tripId}/notes`),
  addNote: (tripId, data) => api.post(`/trips/${tripId}/notes`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  share: (tripId) => api.post(`/trips/${tripId}/share`),
};

export const stopService = {
  update: (id, data) => api.put(`/stops/${id}`, data),
  delete: (id) => api.delete(`/stops/${id}`),
  addActivity: (stopId, data) => api.post(`/stops/${stopId}/activities`, data),
};

export const activityService = {
  remove: (id) => api.delete(`/trip-activities/${id}`),
};
