import { API_BASE_URL } from '../config/api.js';

export const fetchKpiData = (query) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_BASE_URL}/kpi?${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};