export const fetchRevenueData = async (queryString) => {
  if (!queryString) throw new Error("No query string provided");
  return fetch(`http://localhost:8080/revenue?${queryString}`);
};