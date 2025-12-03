import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isMock = searchParams.get('mock') === 'true';
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Optional: Track conversion event here
    console.log('Order Success Page Loaded');
    console.log('Order ID:', orderId);
    console.log('Mock Mode:', isMock);
  }, [orderId, isMock]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Mock Mode Banner */}
        {isMock && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
            <p className="text-sm text-yellow-800 font-semibold">
              🧪 Test Mode - No Real Payment Processed
            </p>
          </div>
        )}

        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <svg 
            className="w-10 h-10 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="3" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          🎉 Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6 text-lg">
          {isMock 
            ? 'This is a test order. Your integration is working perfectly!'
            : 'Thank you for your order! We\'ll send you a confirmation email shortly.'
          }
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono font-bold text-gray-900 text-lg">
              {orderId}
            </p>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <p className="font-semibold text-gray-900 mb-2">📦 What's Next?</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Order confirmation sent to your email</li>
            <li>• Track your order status in My Orders</li>
            <li>• Expect delivery in 3-5 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            📋 View My Orders
          </button>
          
          <button
            onClick={() => navigate('/projects')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            🛍️ Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 py-2 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        {/* Support Message */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@getyourprojectdone.com" className="text-blue-600 hover:underline">
              support@getyourprojectdone.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
