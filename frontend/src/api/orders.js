import { apiRequest } from './api';

// Orders API calls

// Get all orders - GET /api/orders
export const getOrders = async () => {
  return apiRequest('/orders');
};

// Get order by ID - GET /api/orders/:id
export const getOrderById = async (id) => {
  return apiRequest(`/orders/${id}`);
};

// Create new order - POST /api/orders
export const createOrder = async (orderData) => {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

// Update order status - PUT /api/orders/:id/status
export const updateOrderStatus = async (id, status) => {
  return apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// Delete order - DELETE /api/orders/:id
export const deleteOrder = async (id) => {
  return apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  });
};