import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, XCircle, RefreshCw, 
  Truck, CreditCard, AlertCircle, Loader, Image as ImageIcon 
} from 'lucide-react';
import apiEndpoints from '../services/api';
import Pagination from '../components/shared/pagination';
import SharedLoadingComponent from '../components/shared/medicalLoading'; // Added import
import { toast } from 'react-toastify'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import OrderList from '../components/shared/order/orderList';

const MySwal = withReactContent(Swal);
//[SARA]: going back
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null); // State to track specific order being cancelled
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const notify = {
    success: (title, message) => toast.success(
      <div>
        <p className="font-medium">{title}</p>
        {message && <p className="text-sm">{message}</p>}
      </div>,
      { icon: <CheckCircle className="text-green-500" />, position: "top-right", autoClose: 3000 }
    ),
    error: (title, message) => toast.error(
      <div>
        <p className="font-medium">{title}</p>
        {message && <p className="text-sm">{message}</p>}
      </div>,
      { icon: <XCircle className="text-red-500" />, position: "top-right", autoClose: 5000 }
    ),
    info: (title, message) => toast.info(
      <div>
        <p className="font-medium">{title}</p>
        {message && <p className="text-sm">{message}</p>}
      </div>,
      { position: "top-right", autoClose: 3000 }
    ),
  };

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiEndpoints.orders.getPaginatedOrders(
        page,
        pagination.pageSize,
        { ordering: '-created_at' }
      );

      const processedOrders = await Promise.all(
        response.data.results.map(async (order) => {
          if (!order.items_details || order.items_details.length === 0) {
            const itemsWithDetails = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const itemDetail = await apiEndpoints.inventory.getItemDetails(item.product);
                  return {
                    ...item,
                    name: itemDetail.data.name,
                    price: itemDetail.data.price,
                    image: itemDetail.data.image,
                    category: itemDetail.data.category
                  };
                } catch {
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
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load orders';
      setError(errorMessage);
      notify.error('Error loading orders', errorMessage); // Use react-toastify for error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this order? This action cannot be undone.',
      imageUrl: '/images/order_cancel.png',
      imageHeight: 200, 
      imageAlt: 'cancel',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6', 
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (!result.isConfirmed) {
      notify.info('Cancellation avoided', `Order #${orderId} was not cancelled.`);
      return;
    }

    try {
      setCancellingOrderId(orderId); 
      await apiEndpoints.orders.cancelOrder(orderId);
      
      await MySwal.fire('Cancelled!', `Order #${orderId} has been cancelled successfully.`, 'success');
      
      fetchOrders(pagination.currentPage); // Refresh orders to reflect the change
    } catch (err) {
      await MySwal.fire('Error!', err.response?.data?.detail || 'Failed to cancel order.', 'error');
    } finally {
      setCancellingOrderId(null); // Clear specific order loading
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleRefresh = () => {
    notify.info('Refreshing', 'Loading latest orders...');
    fetchOrders(pagination.currentPage);
  };

  // Filter orders by status
  const filteredOrders = statusFilter
    ? orders.filter(order => order.order_status === statusFilter)
    : orders;

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
        <div className="flex gap-2 items-center">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-1.5 text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="on_process">On Process</option>
            <option value="shipping">Shipping</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
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


      {loading && !cancellingOrderId ? (
        <SharedLoadingComponent 
          loadingText="Loading your order history..."
          subText="Gathering all your past purchases..."
          color="blue"
          gif="/ordersLoading.gif"
        />
      ) : orders.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Package className="h-10 w-10 mx-auto text-blue-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No orders found</h3>
          <p className="text-gray-600">Your order history will appear here once you make purchases</p>
        </div>
      ) : (
        <>
          <OrderList
            orders={filteredOrders}
            detailsOrder={detailsOrder}
            setDetailsOrder={setDetailsOrder}
            handleEdit={(order) => {
              if (order.order_status !== 'delivered') {
                setEditOrder(order);
                setEditForm({ order_status: 'delivered' });
              } else {
                toast.info('Order is already delivered.');
              }
            }}
            fetchClientById={null}
            isHistoryPage={true}
          />
          {editOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setModalLoading(true);
                  try {
                    await apiEndpoints.orders.updateOrderStatus(editOrder.id, editForm.order_status);
                    toast.success('Order status updated to delivered.');
                    setEditOrder(null);
                    fetchOrders(pagination.currentPage);
                  } catch (err) {
                    toast.error('Failed to update order status.');
                  } finally {
                    setModalLoading(false);
                  }
                }}
                className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn w-full max-w-md"
              >
                <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none" onClick={() => setEditOrder(null)} aria-label="Close">&times;</button>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-extrabold text-blue-700 tracking-wide">Change Order Status</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-status" className="font-semibold text-gray-700 mb-1">Order Status</label>
                  <select
                    id="edit-status"
                    name="order_status"
                    value={editForm.order_status}
                    onChange={e => setEditForm({ order_status: e.target.value })}
                    className="border border-blue-300 rounded-lg px-4 py-2 bg-white text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base font-semibold"
                    required
                  >
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4 justify-end">
                  <button type="submit" disabled={modalLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {modalLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow transition-all focus:outline-none" onClick={() => setEditOrder(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => fetchOrders(page)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;