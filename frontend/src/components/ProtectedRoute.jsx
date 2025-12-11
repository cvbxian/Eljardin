// src/components/ProtectedRoute.jsx - FIXED VERSION
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check authentication INSIDE the component
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;