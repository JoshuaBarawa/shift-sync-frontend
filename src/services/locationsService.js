import api from './api';

export const locationsService = {
  getAll: () => api.get('/locations').then(r => r.data),
  getOne: (id) => api.get(`/locations/${id}`).then(r => r.data),
  getStaff: (id) => api.get(`/locations/${id}/staff`).then(r => r.data),
};