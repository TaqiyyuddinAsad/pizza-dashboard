
export const API_BASE_URL = 'http://192.168.0.167:8080';
 

export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
}; 