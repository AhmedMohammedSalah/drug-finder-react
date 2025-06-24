import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center text-green-500 mb-3">
            <FaCheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully.
          </p>
          <button
            onClick={() => navigate('/client/pharmacies')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;