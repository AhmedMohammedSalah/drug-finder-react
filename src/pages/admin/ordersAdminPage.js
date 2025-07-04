import React, { useEffect, useState } from 'react';
import Pagination from '../../components/shared/pagination';
import OrderList from '../../components/shared/order/orderList';
import AdminLoader from '../../components/admin/adminLoader';

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [addError, setAddError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 per page for 3x3 grid
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [clientCache, setClientCache] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const token = localStorage.getItem('access_token');

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/orders/?page=${page}&page_size=${pageSize}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched orders:', data);
        // If paginated, expect { results, count }
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
  }, [token, page, pageSize]);

  // Fetch all orders for search (only when search is not empty)
  useEffect(() => {
    if (search.trim() === "") {
      setAllOrders([]);
      return;
    }
    fetch(`http://localhost:8000/orders/?page_size=10000`, {
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
  }, [search, token]);

  // Filter orders by search (id or status)
  const filteredOrders = (search.trim() === "" ? orders : allOrders)
    .filter(order =>
      ((order.id + '').includes(search) ||
        (order.order_status || '').toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "" || order.order_status === statusFilter)
    );

  // Helper to fetch client details by ID (admin endpoint)
  const fetchClientById = async (clientId) => {
    if (!clientId) return "!clientId";
    if (clientCache[clientId]) return clientCache[clientId];
    try {
      const res = await fetch(`http://localhost:8000/users/users/${clientId}/`, {
        headers: { 'Authorization': `Bearer ${token}'` }
      });
      if (!res.ok) return "!res.ok";
      const data = await res.json();
      // console.log('Fetched client:', data);
      setClientCache(prev => ({ ...prev, [clientId]: data }));
      return data;
    } catch {
      return "catch";
    }
  };

  // Add order handlers
  // [SARA]: Add Order logic - allows admin to add a new order with all fields
  const handleAddChange = e => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  // [SARA]: Submit add form and create order (no reload, update state)
  const handleAddSubmit = async e => {
    e.preventDefault();
    setAddError(null);
    try {
      const res = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addForm)
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders([newOrder, ...orders]);
        setShowAddModal(false);
        setAddForm({});
      } else {
        const data = await res.json();
        setAddError(data.detail || 'Failed to add order');
      }
    } catch {
      setAddError('Failed to add order');
    }
  };

  // Edit order handlers
  // [SARA]: Only allow editing the status of the order
  const handleEdit = order => {
    setEditOrder(order);
    setEditForm({ order_status: order.order_status });
  };
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  // [SARA]: Submit edit form and update order (no reload, update state)
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!editOrder || !editOrder.id) return;
    try {
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
    } catch {}
  };

  // [SARA]: Delete order by id (no reload, update state)
  const handleDelete = async id => {
    try {
      await fetch(`http://localhost:8000/orders/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o.id !== id));
    } catch {}
  };

  // Render
  return (
    <div className="relative min-h-screen">
      <AdminLoader loading={loading} error={error} loadingMessage="Loading orders data..." />
      {/* [SARA] : Main content is dimmed and non-interactive while loading or error */}
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
              {/* Status filter dropdown */}
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
          {/* Orders grid */}
          <OrderList
            orders={filteredOrders}
            detailsOrder={detailsOrder}
            setDetailsOrder={setDetailsOrder}
            handleEdit={handleEdit}
            fetchClientById={fetchClientById}
          />
          {/* Pagination controls */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          {/* Add order modal */}
          {/* {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <form onSubmit={handleAddSubmit} className="bg-white rounded-lg p-4 sm:p-8 shadow-lg flex flex-col gap-4 min-w-[90vw] sm:min-w-[350px] max-h-[90vh] overflow-y-auto w-full max-w-md">
                <h2 className="text-xl font-bold mb-2">Add New Order</h2>
                <input name="client" value={addForm.client || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Client ID" required />
                <input name="store" value={addForm.store || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Store ID" required />
                <textarea name="items" value={addForm.items || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder='Items (JSON: [{"item_id":1,"ordered_quantity":2}])' required />
                <input name="shipping_location" value={addForm.shipping_location || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Shipping Location" required />
                <select name="order_status" value={addForm.order_status || ''} onChange={handleAddChange} className="border p-2 rounded" required>
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="on_process">On Process</option>
                  <option value="shipping">Shipping</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
                <select name="payment_method" value={addForm.payment_method || ''} onChange={handleAddChange} className="border p-2 rounded" required>
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="wallet">Wallet</option>
                </select>
                <input name="shipping_cost" value={addForm.shipping_cost || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Shipping Cost" type="number" step="0.01" required />
                <input name="tax" value={addForm.tax || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Tax" type="number" step="0.01" required />
                <input name="total_price" value={addForm.total_price || ''} onChange={handleAddChange} className="border p-2 rounded" placeholder="Total Price" type="number" step="0.01" required />
                {addError && <div className="text-red-500 text-sm">{addError}</div>}
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )} */}
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

export default OrdersAdminPage;