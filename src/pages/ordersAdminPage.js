import React, { useEffect, useState } from 'react';

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [addError, setAddError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [search, setSearch] = useState('');
  const [detailsOrder, setDetailsOrder] = useState(null);
  const token = localStorage.getItem('access_token');

  // Fetch orders
  useEffect(() => {
    fetch('http://localhost:8000/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, [token]);

  // Filter orders by search (id or status)
  const filteredOrders = orders.filter(order =>
    (order.id + '').includes(search) ||
    (order.order_status || '').toLowerCase().includes(search.toLowerCase())
  );

  // Add order handlers
  // [SARA]: Add Order logic - allows admin to add a new order with all fields
  const handleAddChange = e => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddSubmit = async e => {
    e.preventDefault();
    setAddError(null);
    try {
      // [SARA]: Send all order fields as JSON to backend
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
        setOrders([...orders, newOrder]);
        setShowAddModal(false);
        setAddForm({});
      } else {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        setAddError(data.detail || data.error || JSON.stringify(data) || 'Failed to add order');
      }
    } catch { setAddError('Failed to add order'); }
  };

  // Edit order handlers
  // [SARA]: Only allow editing the status of the order
  const handleEdit = order => {
    setEditOrder(order);
    setEditForm({ order_status: order.order_status });
  };
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!editOrder || !editOrder.id) return;
    try {
      // [SARA]: Only send the status field to backend
      const res = await fetch(`http://localhost:8000/orders/${editOrder.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_status: editForm.order_status })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
        setEditOrder(null);
      }
    } catch {}
  };

  // Delete order
  const handleDelete = async id => {
    try {
      await fetch(`http://localhost:8000/orders/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o.id !== id));
    } catch {}
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-6">
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Orders Page</h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or status..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {/* <button
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
          >
            Add New Order
          </button> */}
        </div>
      </div>
      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg">Order #{order.id}</div>
            <div className="text-gray-600">Status: {order.order_status}</div>
            <div className="text-sm text-blue-600">Total: {order.total_price} EGP</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setDetailsOrder(order)}>Details</button>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(order)}>Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => setDeleteOrderId(order.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {/* Add order modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-h-[90vh] overflow-y-auto">
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
      )}
      {/* Edit order modal */}
      {editOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Edit Order Status</h2>
            <select name="order_status" value={editForm.order_status || ''} onChange={handleEditChange} className="border p-2 rounded" required>
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="on_process">On Process</option>
              <option value="shipping">Shipping</option>
              <option value="delivered">Delivered</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditOrder(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteOrderId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex gap-2 mt-2">
              <button onClick={async () => { await handleDelete(deleteOrderId); setDeleteOrderId(null); }} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={() => setDeleteOrderId(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Order details modal */}
      {detailsOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Order Details</h2>
            <div><b>ID:</b> {detailsOrder.id}</div>
            <div><b>Client:</b> {typeof detailsOrder.client === 'object' ? (detailsOrder.client.id || JSON.stringify(detailsOrder.client)) : detailsOrder.client}</div>
            <div><b>Store:</b> {detailsOrder.store == null ? 'N/A' : (typeof detailsOrder.store === 'object' ? (detailsOrder.store.id || JSON.stringify(detailsOrder.store)) : detailsOrder.store)}</div>
            <div><b>Status:</b> {detailsOrder.order_status}</div>
            <div><b>Payment Method:</b> {detailsOrder.payment_method}</div>
            <div><b>Shipping Location:</b> {detailsOrder.shipping_location}</div>
            <div><b>Shipping Cost:</b> {detailsOrder.shipping_cost} EGP</div>
            <div><b>Tax:</b> {detailsOrder.tax} EGP</div>
            <div><b>Total Price:</b> {detailsOrder.total_price} EGP</div>
            <div><b>Items:</b><pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(detailsOrder.items, null, 2)}</pre></div>
            <div><b>Timestamp:</b> {detailsOrder.timestamp}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setDetailsOrder(null)} className="bg-gray-300 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">Loading orders...</div></div>}
      {error && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">{error}</div></div>}
    </div>
  );
}

export default OrdersAdminPage;