export async function fetchStoreRanking(start, end) {
  const res = await fetch(`http://localhost:8080/stores/ranking?start=${start}&end=${end}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}