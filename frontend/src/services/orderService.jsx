export const fetchOrdersData = async (queryString) => {
  return fetch(`http://localhost:8080/orders/chart?${queryString}`);
};
export default fetchOrdersData