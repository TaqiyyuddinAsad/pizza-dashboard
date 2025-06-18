const fetchOrderTimes = async (params) => {
  const res = await fetch(`http://localhost:8080/orders/times?${new URLSearchParams(params)}`);

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
