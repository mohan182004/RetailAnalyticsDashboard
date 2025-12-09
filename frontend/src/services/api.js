import axios from 'axios';

// Use environment variable in production, fallback to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Build query string from filters
const buildQueryParams = (filters) => {
  const params = new URLSearchParams();
  
  // Handle arrays (multi-select)
  if (filters.regions && Array.isArray(filters.regions) && filters.regions.length > 0) {
    params.append('regions', JSON.stringify(filters.regions));
  }
  if (filters.genders && Array.isArray(filters.genders) && filters.genders.length > 0) {
    params.append('genders', JSON.stringify(filters.genders));
  }
  if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
    params.append('categories', JSON.stringify(filters.categories));
  }
  if (filters.paymentMethods && Array.isArray(filters.paymentMethods) && filters.paymentMethods.length > 0) {
    params.append('paymentMethods', JSON.stringify(filters.paymentMethods));
  }
  
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    params.append('tags', JSON.stringify(filters.tags));
  }
  
  // Handle range objects
  if (filters.ageRange && typeof filters.ageRange === 'object' && (filters.ageRange.min || filters.ageRange.max)) {
    params.append('ageRange', JSON.stringify(filters.ageRange));
  }
  if (filters.dateRange && typeof filters.dateRange === 'object' && (filters.dateRange.start || filters.dateRange.end)) {
    params.append('dateRange', JSON.stringify(filters.dateRange));
  }
  
  // Legacy single-value filters
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.brand) params.append('brand', filters.brand);
  if (filters.category) params.append('category', filters.category);
  if (filters.region) params.append('region', filters.region);
  if (filters.status) params.append('status', filters.status);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
  if (filters.tags) params.append('tags', filters.tags);
  
  // Other params
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.order) params.append('order', filters.order);
  
  return params.toString();
};

export const getTransactions = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/transactions?${query}`);
  return response.data;
};

export const getOverview = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/overview?${query}`);
  return response.data;
};

export const getCategorySales = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/category-sales?${query}`);
  return response.data;
};

export const getSalesTrends = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/sales-trends?${query}`);
  return response.data;
};

export const getTopProducts = async (filters = {}, limit = 10) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/top-products?${query}&limit=${limit}`);
  return response.data;
};

export const getBrandSales = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/brand-sales?${query}`);
  return response.data;
};

export const getRegionSales = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/region-sales?${query}`);
  return response.data;
};

export const getFilters = async () => {
  const response = await api.get('/filters');
  return response.data;
};

export const getPaymentMethods = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/payment-methods?${query}`);
  return response.data;
};

export const getOrderStatus = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const response = await api.get(`/order-status?${query}`);
  return response.data;
};

export default api;
