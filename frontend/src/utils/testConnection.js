import { testBackendConnection } from '../api/api';

export const checkAndDisplayConnection = async () => {
  const status = await testBackendConnection();
  
  if (status.connected) {
    console.log('🎉 Backend connected successfully!');
    console.log('Backend data:', status.data);
    return true;
  } else {
    console.error('❌ Backend connection failed:', status.error);
    console.log('Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check if port 5000 is free');
    console.log('3. Verify MariaDB is running');
    return false;
  }
};

// Run on page load in development
if (import.meta.env.DEV) {
  checkAndDisplayConnection();
}