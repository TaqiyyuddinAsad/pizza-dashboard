import { API_BASE_URL } from '../config/api.js';

export const fetchKpiData = (query) => {
  console.log('🚀 fetchKpiData called with query:', query);
  
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/kpi?${query}`;
  
  console.log('🔍 KPI Request Debug:');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('URL:', url);
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
  console.log('Full token:', token);
  
  if (!token) {
    console.error('❌ No token found in localStorage');
    console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
    throw new Error('No authentication token available');
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  console.log('📤 Request headers:', headers);
  console.log('📤 Full request config:', { url, headers });
  
  console.log('🌐 About to make fetch request...');
  
  return fetch(url, { 
    method: 'GET',
    headers,
    mode: 'cors',
    credentials: 'omit'
  })
    .then(response => {
      console.log('📡 KPI Response received');
      console.log('📡 KPI Response status:', response.status);
      console.log('📡 KPI Response statusText:', response.statusText);
      console.log('📡 KPI Response headers:', Object.fromEntries(response.headers.entries()));
      
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