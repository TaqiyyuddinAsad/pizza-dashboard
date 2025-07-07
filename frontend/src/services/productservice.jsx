import { API_BASE_URL } from '../config/api.js';
const API_BASE_URL_FULL = `${API_BASE_URL}/api`;


export const getBestsellersByOrders = async (filters, page = 0, pageSize = 10) => {
    try {
        const params = new URLSearchParams();
        if (filters.store && filters.store.length > 0 && filters.store[0] !== undefined && filters.store[0] !== null && filters.store[0] !== "") params.append('storeId', filters.store[0]);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category && filters.category.length > 0 && filters.category[0] !== undefined && filters.category[0] !== null && filters.category[0] !== "") params.append('category', filters.category[0]);
        if (filters.size && filters.size.length > 0 && filters.size[0] !== undefined && filters.size[0] !== null && filters.size[0] !== "") params.append('size', filters.size[0]);
        params.append('page', page);
        params.append('pageSize', pageSize);

        const response = await fetch(`${API_BASE_URL_FULL}/materialized/bestsellers/orders?${params}`, { headers: getAuthHeader() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching bestsellers by orders:', error);
        throw error;
    }
};



export const getBestsellersByRevenue = async (filters, page = 0, pageSize = 10) => {
    try {
        const params = new URLSearchParams();
        if (filters.store && filters.store.length > 0 && filters.store[0] !== undefined && filters.store[0] !== null && filters.store[0] !== "") params.append('storeId', filters.store[0]);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category && filters.category.length > 0 && filters.category[0] !== undefined && filters.category[0] !== null && filters.category[0] !== "") params.append('category', filters.category[0]);
        if (filters.size && filters.size.length > 0 && filters.size[0] !== undefined && filters.size[0] !== null && filters.size[0] !== "") params.append('size', filters.size[0]);
        params.append('page', page);
        params.append('pageSize', pageSize);

        const response = await fetch(`${API_BASE_URL_FULL}/materialized/bestsellers/revenue?${params}`, { headers: getAuthHeader() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching bestsellers by revenue:', error);
        throw error;
    }
};



export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL_FULL}/materialized/categories`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getSizes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL_FULL}/materialized/sizes`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching sizes:', error);
        throw error;
    }
};

export const getStores = async () => {
    try {
        const response = await fetch(`${API_BASE_URL_FULL}/materialized/stores`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching stores:', error);
        throw error;
    }
};


export const getProductCombinations = async (filters, page = 0, pageSize = 10) => {
    try {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start', filters.startDate);
        if (filters.endDate) params.append('end', filters.endDate);
        if (filters.store && filters.store.length > 0 && filters.store[0] !== undefined && filters.store[0] !== null && filters.store[0] !== "") {
            // Backend expects 'stores' as a list (can be multiple params)
            filters.store.forEach(storeId => {
                if (storeId) params.append('stores', storeId);
            });
        }
        params.append('page', page + 1); // backend is 1-based
        params.append('size', pageSize);

        const response = await fetch(`${API_BASE_URL_FULL}/products/combinations?${params}`, { headers: getAuthHeader() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching product combinations:', error);
        throw error;
    }
};

export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL_FULL}/materialized/products`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};

export const getProductPerformanceAfterLaunch = async (sku, days, filters = {}) => {
    try {
        const params = new URLSearchParams();
        params.append('sku', sku);
        params.append('days', days);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category && filters.category.length > 0) {
            filters.category.forEach(cat => params.append('category', cat));
        }
        // Fix: size as string(s), not [object Object]
        if (filters.size) {
            if (Array.isArray(filters.size)) {
                filters.size.forEach(sz => {
                    if (typeof sz === 'string') params.append('size', sz);
                });
            } else if (typeof filters.size === 'string') {
                params.append('size', filters.size);
            }
        }
        // Only send a single storeId for performance endpoint
        if (filters.stores && filters.stores.length > 0 && typeof filters.stores[0] === 'string') {
            params.append('storeId', filters.stores[0]);
        }
        const url = `${API_BASE_URL_FULL}/materialized/performance?${params}`;
        const response = await fetch(url, { headers: getAuthHeader() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const getCategorySalesTimeline = async (filters) => {
    try {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start', filters.startDate);
        if (filters.endDate) params.append('end', filters.endDate);
        if (filters.store && filters.store.length > 0 && filters.store[0]) params.append('storeId', filters.store[0]);
        if (filters.size && filters.size.length > 0 && filters.size[0]) params.append('size', filters.size[0]);
        const response = await fetch(`${API_BASE_URL_FULL}/materialized/category-sales-timeline?${params}`, { headers: getAuthHeader() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching category sales timeline:', error);
        throw error;
    }
};

export const getSalesBySizePie = async (filters) => {
    try {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start', filters.startDate);
        if (filters.endDate) params.append('end', filters.endDate);
        if (filters.store && filters.store.length > 0) {
            filters.store.forEach(storeId => params.append('stores', storeId));
        }
        const response = await fetch(`${API_BASE_URL_FULL}/products/pie-size?${params}`, { headers: getAuthHeader() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        throw error;
    }
};

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}` };
}
