// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);
  
  const defaultOptions = {
    headers: getAuthHeaders(),
    credentials: 'include',
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Log response for debugging
    console.log(`📡 Response: ${response.status} ${response.statusText}`);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error('❌ API Error:', data);
      
      // Handle specific HTTP errors
      if (response.status === 401) {
        // Unauthorized - clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('❌ API Request Error:', error.message);
    
    // Show user-friendly error message
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Make sure backend is running on http://localhost:5000');
    }
    
    throw error;
  }
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection test:', data);
      return { connected: true, data };
    }
    return { connected: false, error: `Status: ${response.status}` };
  } catch (error) {
    console.error('❌ Backend connection test failed:', error.message);
    return { connected: false, error: error.message };
  }
};

export { API_BASE_URL, apiRequest, getAuthHeaders };