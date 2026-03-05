import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT = 15000; // 15 seconds

// simple callback that can be registered by a provider to track loading state
let loadingCallback: ((value: boolean) => void) | null = null;
export function setLoadingCallback(cb: (value: boolean) => void) {
  loadingCallback = cb;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: DEFAULT_TIMEOUT,
});

// increment/decrement the loader count via the registered callback
function notifyLoading(isLoading: boolean) {
  if (loadingCallback) {
    loadingCallback(isLoading);
  }
}

let requestCount = 0;

api.interceptors.request.use((config) => {
  requestCount += 1;
  notifyLoading(true);
  return config;
}, (error) => {
  notifyLoading(false);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  requestCount = Math.max(requestCount - 1, 0);
  if (requestCount === 0) notifyLoading(false);
  return response;
}, (error) => {
  requestCount = Math.max(requestCount - 1, 0);
  if (requestCount === 0) notifyLoading(false);

  const message = error.response?.data?.detail || error.message || 'Unknown error';
  toast.error(`API Error: ${message}`);
  console.error('API Error:', error.response?.data || error.message);
  return Promise.reject(error);
});

export const vehicleAPI = {
  getAll: () => api.get('/vehicles/'),
  getById: (id: number) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles/', data),
  update: (id: number, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}`)
};

export const maintenanceAPI = {
  getAll: () => api.get('/maintenance/'),
  getById: (id: number) => api.get(`/maintenance/${id}`),
  create: (data: any) => api.post('/maintenance/', data),
  update: (id: number, data: any) => api.put(`/maintenance/${id}`, data),
  delete: (id: number) => api.delete(`/maintenance/${id}`),
  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post('/maintenance/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateApproval: (id: number, status: any) => api.post(`/approvals/${id}/approve`, status)
};

export const fuelAPI = {
  getAll: () => api.get('/fuel/'),
  getById: (id: number) => api.get(`/fuel/${id}`),
  create: (data: any) => api.post('/fuel/', data),
  update: (id: number, data: any) => api.put(`/fuel/${id}`, data),
  delete: (id: number) => api.delete(`/fuel/${id}`),
  getByVehicle: (vehicleId: number) => api.get(`/fuel/vehicle/${vehicleId}`)
};

export const approvalsAPI = {
  getAll: () => api.get('/approvals/'),
  getPending: () => api.get('/approvals/pending'),
  getById: (id: number) => api.get(`/approvals/${id}`),
  approve: (id: number, data: any) => api.post(`/approvals/${id}/approve`, data),
  reject: (id: number, data: any) => api.post(`/approvals/${id}/reject`, data),
  getApproved: () => api.get('/approvals/status/approved'),
  getRejected: () => api.get('/approvals/status/rejected')
};

export default api;

