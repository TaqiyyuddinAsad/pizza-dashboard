const API_BASE_URL = 'http://localhost:8080/api';

// Materialized table endpoints
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

        const response = await fetch(`${API_BASE_URL}/materialized/bestsellers/orders?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching bestsellers by orders:', error);
        throw error;
    }
};

export const getWorstSellersByOrders = async (filters, page = 0, pageSize = 10) => {
    try {
        const params = new URLSearchParams();
        if (filters.store && filters.store.length > 0 && filters.store[0] !== undefined && filters.store[0] !== null && filters.store[0] !== "") params.append('storeId', filters.store[0]);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category && filters.category.length > 0 && filters.category[0] !== undefined && filters.category[0] !== null && filters.category[0] !== "") params.append('category', filters.category[0]);
        if (filters.size && filters.size.length > 0 && filters.size[0] !== undefined && filters.size[0] !== null && filters.size[0] !== "") params.append('size', filters.size[0]);
        params.append('page', page);
        params.append('pageSize', pageSize);

        const response = await fetch(`${API_BASE_URL}/materialized/worst-sellers/orders?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching worst sellers by orders:', error);
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

        const response = await fetch(`${API_BASE_URL}/materialized/bestsellers/revenue?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching bestsellers by revenue:', error);
        throw error;
    }
};

export const getWorstSellersByRevenue = async (filters, page = 0, pageSize = 10) => {
    try {
        const params = new URLSearchParams();
        if (filters.store && filters.store.length > 0 && filters.store[0] !== undefined && filters.store[0] !== null && filters.store[0] !== "") params.append('storeId', filters.store[0]);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category && filters.category.length > 0 && filters.category[0] !== undefined && filters.category[0] !== null && filters.category[0] !== "") params.append('category', filters.category[0]);
        if (filters.size && filters.size.length > 0 && filters.size[0] !== undefined && filters.size[0] !== null && filters.size[0] !== "") params.append('size', filters.size[0]);
        params.append('page', page);
        params.append('pageSize', pageSize);

        const response = await fetch(`${API_BASE_URL}/materialized/worst-sellers/revenue?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching worst sellers by revenue:', error);
        throw error;
    }
};

// Get filter options from materialized table
export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/materialized/categories`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getSizes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/materialized/sizes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching sizes:', error);
        throw error;
    }
};

export const getStores = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/materialized/stores`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching stores:', error);
        throw error;
    }
};

// Remove legacy endpoints and fallback usage for product bestsellers and combinations

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

        const response = await fetch(`${API_BASE_URL}/products/combinations?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching product combinations:', error);
        throw error;
    }
};

export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/materialized/products`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};

export const getProductPerformanceAfterLaunch = async (sku, days, size, storeId) => {
    try {
        const params = new URLSearchParams();
        params.append('sku', sku);
        params.append('days', days);
        if (size) params.append('size', size);
        if (storeId) params.append('storeId', storeId);
        const response = await fetch(`${API_BASE_URL}/materialized/performance?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching product performance after launch:', error);
        throw error;
    }
};
