// Utility function to extract username from JWT token
export const extractUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.username || 'Unknown User';
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return 'Unknown User';
  }
};

// Function to get current user's username
export const getCurrentUsername = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return 'Unknown User';
  }
  return extractUsernameFromToken(token);
}; 