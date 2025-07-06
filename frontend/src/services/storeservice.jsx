import { API_BASE_URL } from '../config/api.js';

export async function fetchStoreRanking(start, end) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/stores/ranking?start=${start}&end=${end}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}