import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaMapMarkerAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import apiEndpoints from '../services/api';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      try {
        const response = await apiEndpoints.orders.getOrder(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className={`max-w-3xl mx-auto relative transform transition-all duration-1000  'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="text-center mb-8">
          <div className="flex justify-center text-green-500 mb-4">
            <FaCheckCircle className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500 mt-2">We've sent a confirmation email with your order details.</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your order details...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {order && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaShoppingBag className="mr-2 text-blue-500" />
                Order Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Number</p>
                  <p className="text-sm font-semibold text-gray-900">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Placed</p>
                  <p className="text-sm text-gray-900">
                    {new Date(order.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-blue-600">${order.total_with_fees}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-6">
                {order.items_details.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                      <div className="w-20 h-20 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                            <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FaBox className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                          </div>                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name || `Item ${index + 1}`}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium text-blue-500">${item.price}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <p className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Shipping Information
                  </h2>
                  <address className="not-italic text-sm text-gray-600">
                    <p  className="mt-2"> 

                      <span className="font-bold"> Shipping Location:</span> {order.shipping_location}


                    </p>
                    <p className="mt-2">
                      <span className="font-bold">Delivery Method:</span> Standard Shipping
                    </p>
                   
                  </address>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FaCreditCard className="mr-2 text-blue-500" />
                    Payment Information
                  </h2>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium capitalize">{order.payment_method}</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-bold">${order.total_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className>Shipping:</span>
                        <span className="font-medium text-blue-500">${order.shipping_cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span className="font-medium text-blue-500">${order.tax}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg text-blue-600">${order.total_with_fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/client/pharmacies')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <FaShoppingBag className="mr-1" />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <FaHome className="mr-1" />
            Back to Home
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default OrderSuccess;