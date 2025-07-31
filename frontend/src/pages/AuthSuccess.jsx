import { useEffect, useState } from 'react';

function AuthSuccess() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      
      // Decode JWT to get user data (basic info)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        
        // Fetch full user data from your API
        fetchUserData(token);
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Invalid token format');
        setLoading(false);
      }
    } else {
      setError('No token found in URL');
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If profile endpoint doesn't exist, extract from token
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          provider: payload.provider || 'google'
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      
      // Fallback to token data
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          provider: payload.provider || 'google'
        });
      } catch (tokenErr) {
        setError('Failed to load user data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Authenticating...</h2>
          <p className="text-gray-500 mt-2">Please wait while we log you in</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login Successful!</h1>
          <p className="text-gray-600">Welcome! Your authentication was successful.</p>
        </div>
        
        {/* User Information */}
        {user && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
              <span className="mr-2">👤</span>
              Your Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600 text-xl">🆔</span>
                  <div>
                    <span className="text-sm text-gray-500 block">User ID</span>
                    <span className="font-medium text-gray-800">{user.id}</span>
                  </div>
                </div>
              </div>
              
              {user.name && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 text-xl">👨‍💼</span>
                    <div>
                      <span className="text-sm text-gray-500 block">Full Name</span>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {user.email && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600 text-xl">📧</span>
                    <div>
                      <span className="text-sm text-gray-500 block">Email Address</span>
                      <span className="font-medium text-gray-800">{user.email}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {user.provider && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-600 text-xl">🔗</span>
                    <div>
                      <span className="text-sm text-gray-500 block">Login Provider</span>
                      <span className="font-medium text-gray-800 capitalize flex items-center">
                        {user.provider}
                        {user.provider === 'google' && <span className="ml-2">🔍</span>}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {user.avatar && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                    />
                    <div>
                      <span className="text-sm text-gray-500 block">Profile Picture</span>
                      <span className="font-medium text-gray-800">Connected from {user.provider}</span>
                    </div>
                  </div>
                </div>
              )}

              {user.username && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-indigo-600 text-xl">@</span>
                    <div>
                      <span className="text-sm text-gray-500 block">Username</span>
                      <span className="font-medium text-gray-800">{user.username}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Success Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-green-500 text-xl mr-3">🎉</span>
            <div>
              <h4 className="font-semibold text-green-800">Authentication Complete</h4>
              <p className="text-green-600 text-sm mt-1">
                You have been successfully logged in to your account.
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            <span className="mr-2">📊</span>
            Go to Dashboard
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center"
          >
            <span className="mr-2">🏠</span>
            Go Home
          </button>
        </div>

        {/* Additional Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                navigator.clipboard.writeText(token);
                alert('Token copied to clipboard!');
              }}
              className="flex-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              📋 Copy Token
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
              }}
              className="flex-1 text-red-600 hover:text-red-800 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthSuccess;