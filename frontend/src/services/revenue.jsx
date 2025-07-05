export const fetchRevenueData = async (queryString) => {
  if (!queryString) throw new Error("No query string provided");
  const token = localStorage.getItem('token');
  console.log('Revenue request - Token:', token ? 'Present' : 'Missing');
  console.log('Revenue request - Token value:', token ? token.substring(0, 20) + '...' : 'None');
  console.log('Revenue request - URL:', `http://localhost:8080/revenue?${queryString}`);
  
  try {
    const res = await fetch(`http://localhost:8080/revenue?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Revenue response status:', res.status);
    console.log('Revenue response headers:', Object.fromEntries(res.headers.entries()));
    
    if (res.status === 401) {
      console.log('Unauthorized - checking if token is expired');
      // Only clear token if it's actually expired
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = Date.now() > payload.exp * 1000;
          if (isExpired) {
            console.log('Token is expired, clearing and redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else {
            console.log('Token not expired, keeping it');
          }
        } catch (e) {
          console.log('Error parsing token, clearing it');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return null;
    }
    if (!res.ok) {
      console.log('Revenue request failed with status:', res.status);
      const errorText = await res.text();
      console.log('Revenue error response:', errorText);
      console.log('Revenue error response length:', errorText.length);
      throw new Error(`Failed to fetch revenue data: ${res.status} - ${errorText}`);
    }
    return res.json();
  } catch (error) {
    console.log('Revenue request exception:', error);
    throw error;
  }
};