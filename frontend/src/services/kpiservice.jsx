export const fetchKpiData = (query) => {
  const token = localStorage.getItem('token');
  return fetch(`http://localhost:8080/kpi?${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};