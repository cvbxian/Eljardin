import { apiRequest } from './api';

// Auth API calls - MUST MATCH YOUR BACKEND ROUTES

// Login user - POST /api/auth/login
export const login = async (email, password) => {
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token and user data
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

// Register user - POST /api/auth/signup
export const signup = async (name, email, password, address = '') => {
  try {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, address }),
    });
    
    // Store token and user data
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return data;
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  // Optional: Call backend logout endpoint if you have one
  // return apiRequest('/auth/logout', { method: 'POST' });
};

// Get current user profile - GET /api/users/profile (if you have this route)
export const getProfile = async () => {
  return apiRequest('/users/profile');
};

// Update user profile - PUT /api/users/profile (if you have this route)
export const updateProfile = async (userData) => {
  return apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  return !!(token && isAuth);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};