import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, XCircle, RefreshCw, 
  Truck, CreditCard, AlertCircle, Loader,
  ChevronLeft, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import apiEndpoints from '../services/api';
import Pagination from '../components/shared/pagination';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiEndpoints.orders.getPaginatedOrders(
        page, 
        pagination.pageSize,
        { ordering: '-created_at' }
      );
      
      // [OKS] Process orders with item details
      const processedOrders = await Promise.all(
        response.data.results.map(async (order) => {
          console.log("response ", order);
          if (!order.items_details || order.items_details.length === 0) {
            const itemsWithDetails = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const itemDetail = await apiEndpoints.inventory.getItemDetails(item.product);
                  console.log("item details: " , itemDetail);
                  return {
                    ...item,
                    name: itemDetail.data.name,
                    price: itemDetail.data.price,
                    image: itemDetail.data.image,
                    category: itemDetail.data.category
                  };
                } catch (err) {
                  console.error('Error fetching item details:', err);
                  return {
                    ...item,
                    name: `Item ${item.product}`,
                    price: 0,
                    image: null,
                    category: 'unknown'
                  };
                }
              })
            );
            return { ...order, items_details: itemsWithDetails };
          }
          return order;
        })
      );

      setOrders(processedOrders);
      setPagination(prev => ({
        ...prev,
        count: response.data.count,
        currentPage: page,
        totalPages: Math.ceil(response.data.count / prev.pageSize)
      }));
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'processing': return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-indigo-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (order_status) => {
    switch(order_status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = () => {
    fetchOrders(pagination.currentPage);
  };

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Package className="h-6 w-6 mr-2 text-blue-600" />
          Order History
          {pagination.count > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({pagination.count} orders)
            </span>
          )}
        </h1>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Package className="h-10 w-10 mx-auto text-blue-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No orders found</h3>
          <p className="text-gray-600">Your order history will appear here once you make purchases</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </div>
                    <span className="text-sm text-gray-500">
                      #{order.id} • {formatDate(order.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                Total: ${parseFloat(order.total_price || 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Items ({order.items.length})</h3>
                    <div className="space-y-3">
                      {order.items_details?.map((item, index) => (
                        <div key={index} className="flex gap-3 py-2">
                          <div className="flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500 capitalize">
                              {item.category} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}

                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;