export const fetchKpiData = (query) => {
  return fetch(`http://localhost:8080/kpi?${query}`);
};