export const API_BASE_URL = 'http://localhost:8080';
 

export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
}; 