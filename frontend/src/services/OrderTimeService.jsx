const fetchOrderTimes = async (params) => {
  const token = localStorage.getItem('token');
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(`http://localhost:8080/orders/times?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Erst Loggen – aber mit .clone()
  const responseText = await res.clone().text();
  console.log("DEBUG Backend-Response:", responseText);

  if (!res.ok) {
    throw new Error(`Backend Error ${res.status}: ${responseText}`);
  }

  // Dann als JSON zurückgeben
  return res.json();
};
export default fetchOrderTimes;
