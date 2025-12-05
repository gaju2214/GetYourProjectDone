import { useState } from 'react';
import axios from 'axios';

const ShiprocketCheckoutButton = ({ cartItems, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate cart
      if (!cartItems || cartItems.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      if (!userId) {
        setError('Please login to checkout');
        setLoading(false);
        return;
      }

      console.log('🔄 Generating Shiprocket Checkout token...');

      // Generate checkout token from your backend
      const { data } = await axios.post(
        'http://localhost:5000/api/shiprocket-checkout/generate-token',
        {
          userId: userId,
          cartItems: cartItems.map(item => ({
            projectId: item.projectId || item.id,
            quantity: item.quantity || 1
          }))
        }
      );

      if (!data.success || !data.token) {
        throw new Error('Failed to generate checkout token');
      }

      console.log('✅ Token generated:', data.token);
      console.log('📦 Shiprocket Order ID:', data.order_id);

      // Check if Shiprocket Checkout is loaded
      if (!window.HeadlessCheckout) {
        throw new Error('Shiprocket Checkout not loaded. Please refresh the page.');
      }

      // Open Shiprocket Checkout iframe
      window.HeadlessCheckout.addToCart(e, data.token, {
        fallbackUrl: window.location.origin + '/cart'
      });

      // Optional: Call success callback
      if (onSuccess) {
        onSuccess(data.order_id);
      }

    } catch (err) {
      console.error('❌ Checkout error:', err);
      setError(err.response?.data?.error || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading || !cartItems || cartItems.length === 0}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          '🚀 Checkout with Shiprocket'
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500 text-center">
        Secure checkout powered by Shiprocket
      </p>
    </div>
  );
};

export default ShiprocketCheckoutButton;
