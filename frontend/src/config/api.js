// API Configuration
export const API_BASE_URL = 'http://192.168.0.167:8080';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
}; 