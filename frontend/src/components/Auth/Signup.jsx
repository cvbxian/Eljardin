import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { signup as signupApi } from '../../api/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await signupApi(formData.name, formData.email, formData.password);
      console.log('📝 Signup API response:', response);
      
      // backend returns userId on success; if token provided, signupApi stores it
      if (response && (response.userId || response.token)) {
        console.log('✅ Signup successful, user ID:', response.userId);
        console.log('🔑 Token stored in localStorage');
        
        // Verify what was stored
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        console.log('💾 Verified stored token:', storedToken ? 'YES' : 'NO');
        console.log('💾 Verified stored user:', storedUser ? 'YES' : 'NO');
        
        // Navigate to home
        navigate('/');
      } else {
        setError(response.message || response.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to signup. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="123 456-7890"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
          required
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-lg hover:from-amber-700 hover:to-orange-600 transition-all duration-300"
      >
        Create Account
      </button>
      
      <div className="text-center mt-6 pt-6 border-t border-gray-200">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 font-medium hover:text-amber-700">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Signup;