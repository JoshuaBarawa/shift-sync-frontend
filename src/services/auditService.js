import api from './api';

export const auditService = {
  // Get all audit logs (admin only)
  getAuditLogs: async (params) => {
    const { data } = await api.get('/audit/logs', { params });
    return data;
  },

  // Get shift history
  getShiftAudit: async (shiftId) => {
    const { data } = await api.get(`/audit/shifts/${shiftId}`);
    return data;
  },
};
