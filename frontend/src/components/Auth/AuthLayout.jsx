const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">El Jardín</h1>
          <p className="text-amber-700">Fine Dining Restaurant</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          
          {children}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">© 2024 El Jardín Restaurant. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;