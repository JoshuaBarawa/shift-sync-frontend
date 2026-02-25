import api from './api';

export const shiftsService = {
  getAll: (locationId) => {
    const params = locationId ? { locationId } : {};
    return api.get('/shifts', { params }).then(r => r.data);
  },
  
  getOne: (id) => api.get(`/shifts/${id}`).then(r => r.data),

  createShift: (data) => api.post('/shifts', {
    ...data,
    headcount: Number(data.headcount),
    locationId: Number(data.locationId),
  }).then(r => r.data),

  updateShift: (id, data) => api.patch(`/shifts/${id}`, data).then(r => r.data),

  publishShift: (id) => api.patch(`/shifts/${id}/publish`).then(r => r.data),

  unpublishShift: (id) => api.patch(`/shifts/${id}/unpublish`).then(r => r.data),

  cancelShift: (id) => api.delete(`/shifts/${id}`).then(r => r.data),

  assignStaff: (shiftId, userId) =>
    api.post(`/shifts/${shiftId}/assign`, { userId: Number(userId) }).then(r => r.data),

  unassignStaff: (shiftId, userId) =>
    api.delete(`/shifts/${shiftId}/assign/${userId}`).then(r => r.data),

  getQualifiedStaff: (shiftId) =>
    api.get(`/shifts/${shiftId}/qualified-staff`).then(r => r.data),

  getWeeklyHours: (userId, weekStartDate) =>
    api.get('/shifts/hours/weekly', { params: { userId, weekStartDate } }).then(r => r.data),

  getShiftAuditHistory: (shiftId) =>
    api.get(`/audit/shifts/${shiftId}`).then(r => r.data),
};
