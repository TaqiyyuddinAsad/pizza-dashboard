export const fetchRevenueData = async (queryString) => {
  if (!queryString) throw new Error("No query string provided");
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/revenue?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    window.location.href = '/login';
    return null;
  }
  if (!res.ok) throw new Error('Failed to fetch revenue data');
  return res.json();
};