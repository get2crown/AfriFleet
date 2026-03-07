import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Global loading callback (will be set by LoadingContext)
let loadingCallback: ((isLoading: boolean) => void) | null = null;

// Function to register the loading callback from context
export const setLoadingCallback = (callback: (isLoading: boolean) => void) => {
  loadingCallback = callback;
};

// Create axios instance (only once!)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to start loading
api.interceptors.request.use(
  (config) => {
    if (loadingCallback) {
      loadingCallback(true);
    }
    return config;
  },
  (error) => {
    if (loadingCallback) {
      loadingCallback(false);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to stop loading
api.interceptors.response.use(
  (response) => {
    if (loadingCallback) {
      loadingCallback(false);
    }
    return response;
  },
  (error) => {
    if (loadingCallback) {
      loadingCallback(false);
    }
    return Promise.reject(error);
  }
);

// Vehicle API calls
export const vehicleAPI = {
  getAll: () => api.get('/vehicles/'),
  getById: (id: number) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles/', data),
  update: (id: number, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
};

// Maintenance API calls
export const maintenanceAPI = {
  getAll: () => api.get('/maintenance/'),
  getById: (id: number) => api.get(`/maintenance/${id}`),
  create: (data: any) => api.post('/maintenance/', data),
  update: (id: number, data: any) => api.put(`/maintenance/${id}`, data),
  delete: (id: number) => api.delete(`/maintenance/${id}`),
};

// Fuel API calls
export const fuelAPI = {
  getAll: () => api.get('/fuel/'),
  create: (data: any) => api.post('/fuel/', data),
  getByVehicle: (vehicleId: number) => api.get(`/fuel/vehicle/${vehicleId}`),
  getStats: (startDate?: string, endDate?: string) => 
    api.get('/fuel/stats', { params: { start_date: startDate, end_date: endDate } }),
};

// Approvals API calls
export const approvalsAPI = {
  getPending: () => api.get('/approvals/pending'),
  decide: (issueId: number, decision: string, comments?: string) => 
    api.post(`/approvals/${issueId}/decide`, { decision, comments }),
};

export default api;