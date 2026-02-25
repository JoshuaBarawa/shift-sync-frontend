import api from './api';

export const staffService = {
  getAllStaff: (params) => api.get('/users', { params }).then(r => r.data),
  getStaff: (id) => api.get(`/users/${id}`).then(r => r.data),

  // ⚠️ FIX: backend route is GET /availability/users/:userId
  // your version was correct but keep consistent pattern
  getAvailability: (userId) =>
    api.get(`/availability/users/${userId}`).then(r => r.data),

  // ⚠️ FIX: each availability record is posted individually
  // dto shape: { dayOfWeek, startTime, endTime, isAvailable }
  setAvailability: (userId, availabilityData) =>
    api.post(`/availability/users/${userId}`, availabilityData).then(r => r.data),

  // ⚠️ FIX: delete a single availability record
  // backend route is DELETE /availability/:id/users/:userId
  deleteAvailability: (availabilityId, userId) =>
    api.delete(`/availability/${availabilityId}/users/${userId}`).then(r => r.data),

  // Availability exceptions
  getExceptions: (userId) =>
    api.get(`/availability/users/${userId}/exceptions`).then(r => r.data),
  addException: (userId, data) =>
    api.post(`/availability/users/${userId}/exceptions`, data).then(r => r.data),
  deleteException: (exceptionId, userId) =>
    api.delete(`/availability/exceptions/${exceptionId}/users/${userId}`).then(r => r.data),
};