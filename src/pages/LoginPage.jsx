import AuthLayout from '../components/Auth/AuthLayout';
import Login from '../components/Auth/Login';

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue"
    >
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;
