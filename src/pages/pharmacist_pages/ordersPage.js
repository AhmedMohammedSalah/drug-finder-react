import React, { useEffect, useState } from 'react';
import Pagination from '../../components/shared/pagination';
import OrderList from '../../components/shared/order/orderList';
import AdminLoader from '../../components/admin/adminLoader';
// import { useAuth } from '../context/AuthContext';

function OrdersPage() {
  // const { user, token } = useAuth();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const pharmacistId = user ? user.id : null;
  const token = localStorage.getItem('access_token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [clientCache, setClientCache] = useState({});
  const [statusFilter, setStatusFilter] = useState("");

  // Get store id from API by pharmacist id (user.id)
  const [storeId, setStoreId] = useState(null);
// console.log("user ", pharmacistId)
  useEffect(() => {
    if (!user?.id || !token) return;
    // Fetch store for this pharmacist
    // console.log("user ", user)
    fetch(`http://localhost:8000/medical_stores/?owner_id=${pharmacistId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("stores" , data.results)
        // If paginated, expect { results: [...] }
        const stores = Array.isArray(data) ? data.results : data.results;
        if (stores && stores.length > 0) {
          console.log("store ", stores[0].id)
          setStoreId(stores[0].id); // Use the first store found
        } else {
          setStoreId(null);
        }
      })
      .catch(() => setStoreId(null));
  }, [user, token]);

  // Fetch orders for this store
  useEffect(() => {
    if (!storeId || !token) return;
    setLoading(true);
    fetch(`http://localhost:8000/orders/?store_id=${storeId}&page=${page}&page_size=${pageSize}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          setTotalPages(1);
        } else {
          setOrders(data.results || []);
          setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, [token, storeId, page, pageSize]);

  // Fetch all orders for search (only when search is not empty)
  useEffect(() => {
    if (!storeId || !token || search.trim() === "") {
      setAllOrders([]);
      return;
    }
    fetch(`http://localhost:8000/orders/?store=${storeId}&page_size=10000`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllOrders(data);
        } else {
          setAllOrders(data.results || []);
        }
      })
      .catch(() => setAllOrders([]));
  }, [search, token, storeId]);

  // Filter orders by search (id or status)
  const filteredOrders = (search.trim() === "" ? orders : allOrders)
    .filter(order =>
      ((order.id + '').includes(search) ||
        (order.order_status || '').toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "" || order.order_status === statusFilter)
    );

  // Helper to fetch client details by ID
  const fetchClientById = async (clientId) => {
    if (!clientId) return "!clientId";
    if (clientCache[clientId]) return clientCache[clientId];
    try {
      const res = await fetch(`http://localhost:8000/users/users/${clientId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return "!res.ok";
      const data = await res.json();
      setClientCache(prev => ({ ...prev, [clientId]: data }));
      return data;
    } catch {
      return "catch";
    }
  };

  // Edit order modal state
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Handle edit button click
  const handleEdit = (order) => {
    setEditOrder(order);
    setEditForm({ order_status: order.order_status });
  };
  // Handle status change in modal
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  // Submit status update
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrder || !editOrder.id) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/orders/${editOrder.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
        setEditOrder(null);
      }
    } catch {
      setError('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AdminLoader loading={loading} error={error} loadingMessage="Loading orders data..." />
      <div className={`container mx-auto px-4 pb-24 ${loading || error ? 'opacity-50 pointer-events-none select-none' : 'opacity-100'}`}>
        <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-2 sm:p-4 md:p-6 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-full max-w-5xl flex flex-col items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-blue-700 drop-shadow">Orders</h1>
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-80 rounded-xl shadow px-2 sm:px-3 md:px-4 py-2 sm:py-3 border border-blue-200 w-full">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by order ID or status..."
                  className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base min-w-0"
                />
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-80 rounded-xl shadow px-2 sm:px-3 py-2 border border-blue-200 min-w-[140px] sm:min-w-[180px] mt-2 sm:mt-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border-none outline-none bg-transparent text-gray-900 text-base w-full cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="on_process">On Process</option>
                  <option value="shipping">Shipping</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>
          <OrderList
            orders={filteredOrders}
            detailsOrder={detailsOrder}
            setDetailsOrder={setDetailsOrder}
            handleEdit={handleEdit}
            fetchClientById={fetchClientById}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          {/* Edit order modal */}
          {editOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn w-full max-w-md">
                <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none" onClick={() => setEditOrder(null)} aria-label="Close">
                  &times;
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6H3v6z" /></svg>
                  <h2 className="text-2xl font-extrabold text-blue-700 tracking-wide">Edit Order Status</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-status" className="font-semibold text-gray-700 mb-1">Order Status</label>
                  <select
                    id="edit-status"
                    name="order_status"
                    value={editForm.order_status || ''}
                    onChange={handleEditChange}
                    className="border border-blue-300 rounded-lg px-4 py-2 bg-white text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base font-semibold"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="on_process">On Process</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4 justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">Save</button>
                  <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow transition-all focus:outline-none" onClick={() => setEditOrder(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;