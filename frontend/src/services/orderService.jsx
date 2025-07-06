import { API_BASE_URL } from '../config/api.js';

export const fetchOrdersData = async (queryString) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_BASE_URL}/orders/chart?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
export default fetchOrdersData