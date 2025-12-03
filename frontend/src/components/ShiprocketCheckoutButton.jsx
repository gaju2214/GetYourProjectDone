import { useState } from 'react';
import axios from 'axios';

// ✅ Set to true for mock checkout, false when Shiprocket is ready
const USE_MOCK = true;

const ShiprocketCheckoutButton = ({ cartItems, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

      console.log('🔄 Generating checkout token...');

      // Choose endpoint based on USE_MOCK flag
      const endpoint = USE_MOCK 
        ? '/api/shiprocket-checkout/generate-token-mock'
        : '/api/shiprocket-checkout/generate-token';

      const { data } = await axios.post(
        `http://localhost:5000${endpoint}`,
        {
          userId: userId,
          cartItems: cartItems.map(item => ({
            id: item.id,
            projectId: item.projectId || item.id,
            quantity: item.quantity || 1,
            price: item.price || 0,
            title: item.title
          }))
        }
      );

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate checkout token');
      }

      console.log('✅ Token generated:', data.token);

      // If using mock, redirect to success page after 2 seconds
      if (USE_MOCK || data.mock) {
        console.log('⚠️ Mock checkout mode - redirecting to success page');
        
        // Show success message
        alert('🧪 Mock checkout successful! Redirecting to order confirmation...');
        
        setTimeout(() => {
          if (onSuccess) onSuccess(data.order_id);
          window.location.href = `/order-success?mock=true&order_id=${data.order_id}`;
        }, 2500); // Wait 2.5 seconds for order to be created
        
        return;
      }

      // Real Shiprocket Checkout (when ready)
      if (!window.HeadlessCheckout) {
        throw new Error('Shiprocket Checkout not loaded. Please refresh the page.');
      }

      window.HeadlessCheckout.addToCart(e, data.token, {
        fallbackUrl: window.location.origin + '/cart'
      });

      if (onSuccess) onSuccess(data.order_id);

    } catch (err) {
      console.error('❌ Checkout error:', err);
      setError(err.response?.data?.error || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {USE_MOCK && (
        <div className="mb-3 p-2 bg-yellow-100 border border-yellow-400 rounded text-sm text-yellow-800 text-center">
          🧪 Test Mode Active
        </div>
      )}
      
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
          <>
            {USE_MOCK ? '🧪 Test Checkout' : '🚀 Checkout with Shiprocket'}
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500 text-center">
        {USE_MOCK ? '🧪 No payment required in test mode' : '🔒 Secure checkout powered by Shiprocket'}
      </p>
    </div>
  );
};

export default ShiprocketCheckoutButton;
