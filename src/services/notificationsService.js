import api from './api';

export const notificationsService = {
  getNotifications: () => api.get('/notifications').then(r => r.data),
  getUnreadCount: () => api.get('/notifications/unread-count').then(r => r.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllAsRead: () => api.patch('/notifications/read-all').then(r => r.data),
};