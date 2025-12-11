import AuthLayout from '../components/Auth/AuthLayout';
import Signup from '../components/Auth/Signup';

const SignupPage = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join El Jardín for exclusive benefits"
    >
      <Signup />
    </AuthLayout>
  );
};

export default SignupPage;
