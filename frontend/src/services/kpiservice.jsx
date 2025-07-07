import { API_BASE_URL } from '../config/api.js';

export const fetchKpiData = (query) => {
  
  
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/kpi?${query}`;
  
 
  
  if (!token) {
    
    throw new Error('No authentication token available');
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  
  return fetch(url, { 
    method: 'GET',
    headers,
    mode: 'cors',
    credentials: 'omit'
  })
    .then(response => {
   
      
      if (!response.ok) {
        console.error('❌ KPI Request failed:', response.status, response.statusText);
        return response.text().then(text => {
          console.error('❌ KPI Error body:', text);
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      
      return response.json();
    })
    .catch(error => {
      console.error('💥 KPI Request error:', error);
      throw error;
    });
};