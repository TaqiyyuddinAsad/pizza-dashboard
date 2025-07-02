export async function fetchStoreRanking(start, end) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/stores/ranking?start=${start}&end=${end}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}