import api from './api';

export const swapsService = {
  getAllSwaps: (status) => {
    const params = status ? { status } : {};
    return api.get('/swaps', { params }).then(r => r.data);
  },
  getSwap: (id) => api.get(`/swaps/${id}`).then(r => r.data),
  createSwap: (swapData) => api.post('/swaps', swapData).then(r => r.data),
  acceptSwap: (id) => api.post(`/swaps/${id}/accept`).then(r => r.data),

  // ⚠️ backend RejectDto expects { reason: string } — was correct already
  declineSwap: (id, reason) =>
    api.post(`/swaps/${id}/decline`, { reason }).then(r => r.data),

  pickupDrop: (id) => api.post(`/swaps/${id}/pickup`).then(r => r.data),
  cancelSwap: (id) => api.post(`/swaps/${id}/cancel`).then(r => r.data),
  approveSwap: (id) => api.post(`/swaps/${id}/approve`).then(r => r.data),

  // ⚠️ backend RejectDto expects { reason: string } — was correct already
  rejectSwap: (id, reason) =>
    api.post(`/swaps/${id}/reject`, { reason }).then(r => r.data),
};
