// services/authService.js
import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Store token and user in localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data; // { accessToken, user }
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};

export default authService;