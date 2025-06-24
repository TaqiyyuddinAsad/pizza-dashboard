import axios from "axios";

const API = "/products";

export const fetchProductRanking = async (start, end) => {
  const res = await fetch(`http://localhost:8080/products/ranking?start=${start}&end=${end}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

export const fetchBestseller = async (start, end, stores = [], categories = [], sizes = []) => {
  const params = new URLSearchParams({ start, end });
  if (stores.length) stores.forEach(s => params.append('stores', s));
  if (categories.length) categories.forEach(c => params.append('categories', c));
  if (sizes.length) sizes.forEach(sz => params.append('sizes', sz));
  const res = await fetch(`http://localhost:8080/products/bestseller?${params.toString()}`);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
};

export const fetchCombinations = (params) => axios.get(`${API}/combinations`, { params });

export const fetchCategorySales = (params) => axios.get(`${API}/category-sales`, { params });

export const fetchBestsellers = (params) => axios.get(`${API}/bestseller`, { params });

export const fetchPerformance = (params) => axios.get(`${API}/performance`, { params });

export const fetchPieBySize = (params) => axios.get(`${API}/pie-size`, { params });
