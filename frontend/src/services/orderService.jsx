export const fetchOrdersData = async (queryString) => {
  const token = localStorage.getItem('token');
  return fetch(`http://localhost:8080/orders/chart?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
export default fetchOrdersData