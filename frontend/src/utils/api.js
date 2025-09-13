import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API calls
export const adminAPI = {
  login: (email, password) => 
    api.post('/admin/login', { email, password }),
  
  getDashboard: () => 
    api.get('/admin/dashboard'),
  
  getPlans: () => 
    api.get('/admin/plans'),
  
  getDiscounts: () => 
    api.get('/admin/discounts'),
  
  getUsers: () => 
    api.get('/admin/users'),
  
  getAnalytics: () => 
    api.get('/admin/analytics'),
};

// User API calls
export const userAPI = {
  signup: (name, email, password) => 
    api.post('/user/signup', { name, email, password }),
  
  login: (email, password) => 
    api.post('/user/login', { email, password }),
  
  getDashboard: () => 
    api.get('/user/dashboard'),
  
  getSubscriptions: () => 
    api.get('/user/subscriptions'),
  
  getRecommendations: () => 
    api.get('/user/recommendations'),
  
  getUsage: () => 
    api.get('/user/usage'),
  
  getBilling: () => 
    api.get('/user/billing'),
};

export default api;
