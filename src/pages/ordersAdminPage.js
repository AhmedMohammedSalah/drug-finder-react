import React, { useEffect, useState } from "react";
import apiEndpoints from "../services/api";

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [addError, setAddError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9); // 9 per page for 3x3 grid
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [clientCache, setClientCache] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const token = localStorage.getItem("access_token");

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://ahmedmsalah.pythonanywhere.com/orders/?page=${page}&page_size=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log('Fetched orders:', data);
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
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }, [token, page, pageSize]);

  // Fetch all orders for search (only when search is not empty)
  useEffect(() => {
    if (search.trim() === "") {
      setAllOrders([]);
      return;
    }
    fetch(`https://ahmedmsalah.pythonanywhere.com/orders/?page_size=10000`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllOrders(data);
        } else {
          setAllOrders(data.results || []);
        }
      })
      .catch(() => setAllOrders([]));
  }, [search, token]);

  // Filter orders by search (id or status)
  const filteredOrders = (search.trim() === "" ? orders : allOrders).filter(
    (order) =>
      ((order.id + "").includes(search) ||
        (order.order_status || "")
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (statusFilter === "" || order.order_status === statusFilter)
  );

  // Helper to fetch client details by ID (admin endpoint)
  const fetchClientById = async (clientId) => {
    if (!clientId) return "!clientId";
    if (clientCache[clientId]) return clientCache[clientId];
    try {
      const res = await fetch(
        `https://ahmedmsalah.pythonanywhere.com/users/users/${clientId}/`,
        {
          headers: { Authorization: `Bearer ${token}'` },
        }
      );
      if (!res.ok) return "!res.ok";
      const data = await res.json();
      // console.log('Fetched client:', data);
      setClientCache((prev) => ({ ...prev, [clientId]: data }));
      return data;
    } catch {
      return "catch";
    }
  };

  // Add order handlers
  // [SARA]: Add Order logic - allows admin to add a new order with all fields
  const handleAddChange = (e) =>
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    try {
      // [SARA]: Send all order fields as JSON to backend
      const res = await fetch("https://ahmedmsalah.pythonanywhere.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders([...orders, newOrder]);
        setShowAddModal(false);
        setAddForm({});
      } else {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        setAddError(
          data.detail ||
            data.error ||
            JSON.stringify(data) ||
            "Failed to add order"
        );
      }
    } catch {
      setAddError("Failed to add order");
    }
  };

  // Edit order handlers
  // [SARA]: Only allow editing the status of the order
  const handleEdit = (order) => {
    setEditOrder(order);
    setEditForm({ order_status: order.order_status });
  };
  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrder || !editOrder.id) return;
    try {
      // [SARA]: Only send the status field to backend
      const res = await fetch(
        `https://ahmedmsalah.pythonanywhere.com/orders/${editOrder.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order_status: editForm.order_status }),
        }
      );
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(
          orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
        setAllOrders(
          allOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
        setEditOrder(null);
      }
    } catch {}
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-6">
      <div className="w-full max-w-5xl flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold text-center mb-4 text-blue-700 drop-shadow">
          Orders Page
        </h1>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-80 rounded-xl shadow px-3 py-2 border border-blue-200">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or status..."
              className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base"
            />
          </div>
          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 bg-white bg-opacity-80 rounded-xl shadow px-3 py-2 border border-blue-200 min-w-[180px]">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-12">
            No orders found.
          </div>
        ) : (
          filteredOrders.map((order) => {
            // console.log('Rendering order store:', order.store);
            const isOpen = detailsOrder && detailsOrder.id === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 hover:shadow-xl transition-shadow duration-200 w-full col-span-full"
              >
                <div className="flex flex-row items-center gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="font-bold text-xl text-blue-800 flex items-center gap-2">
                      <span className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold">
                        Order #{order.id}
                      </span>
                    </div>
                    <div className="text-gray-700 flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={
                          `px-2 py-1 rounded text-xs font-bold ` +
                          (order.order_status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.order_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.order_status === "paid"
                            ? "bg-blue-100 text-blue-700"
                            : order.order_status === "on_process"
                            ? "bg-purple-100 text-purple-700"
                            : order.order_status === "shipping"
                            ? "bg-orange-100 text-orange-700"
                            : order.order_status === "canceled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700")
                        }
                      >
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">
                      Total: {order.total_price} EGP
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end ml-4 min-w-[120px]">
                    <button
                      className={`flex items-center justify-center gap-2 ${
                        isOpen
                          ? "bg-gray-500 hover:bg-gray-700"
                          : "bg-blue-500 hover:bg-blue-700"
                      } text-white px-4 py-2 rounded-lg shadow-md transition font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:scale-95 duration-100`}
                      onClick={() => setDetailsOrder(isOpen ? null : order)}
                    >
                      {isOpen ? "Hide Details" : "Show Details"}
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:scale-95 duration-100"
                      onClick={() => handleEdit(order)}
                    >
                      Edit Status
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div
                    className="mt-6 border-t pt-6 bg-gray-50 rounded-xl overflow-hidden transition-all duration-500 ease-in-out shadow-lg border border-blue-200 max-w-2xl mx-auto px-6 pb-6"
                    style={{
                      maxHeight: isOpen ? 800 : 0,
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "scaleY(1)" : "scaleY(0.98)",
                      transition:
                        "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    {/* Receipt Header */}
                    <div className="flex items-center gap-4 mb-6 border-b pb-3 border-blue-100">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7h18M3 12h18M3 17h18"
                        />
                      </svg>
                      <span className="text-2xl font-extrabold text-blue-700 tracking-wide">
                        Order Receipt
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {order.timestamp}
                      </span>
                    </div>
                    {/* Receipt Body: 2-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mb-6">
                      <div>
                        <span className="font-semibold text-gray-700">
                          Order ID:
                        </span>{" "}
                        <span className="text-gray-900">{order.id}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Client:
                        </span>
                        <ClientDetails
                          client={order.client}
                          fetchClientById={fetchClientById}
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Store:
                        </span>
                        <StoreDetails store={order.store} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Status:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.order_status}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Payment:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.payment_method}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Shipping Location:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.shipping_location}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Shipping Cost:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.shipping_cost} EGP
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Tax:
                        </span>{" "}
                        <span className="text-gray-900">{order.tax} EGP</span>
                      </div>
                    </div>
                    {/* Order Items Table */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7h18M3 12h18M3 17h18"
                          />
                        </svg>
                        <span className="font-bold text-blue-700 text-base tracking-wide">
                          Order Items
                        </span>
                      </div>
                      {order.items_details &&
                      Array.isArray(order.items_details) &&
                      order.items_details.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white mt-2">
                          <table className="min-w-full text-xs md:text-sm">
                            <thead>
                              <tr className="bg-blue-50 text-blue-800">
                                <th className="px-3 py-2 text-left font-semibold">
                                  Name
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                  Quantity
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items_details.map((item, idx) => (
                                <tr
                                  key={idx}
                                  className={
                                    idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"
                                  }
                                >
                                  <td className="px-3 py-2 font-medium text-gray-800">
                                    {item.name}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                      x{item.quantity}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-gray-700 font-semibold">
                                    {item.price} EGP
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto mt-1 text-gray-800">
                          {JSON.stringify(order.items, null, 2)}
                        </pre>
                      )}
                    </div>
                    {/* Receipt Summary */}
                    <div className="flex flex-col items-end border-t pt-5 border-blue-100">
                      <div className="flex flex-col gap-2 w-full max-w-xs">
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Shipping Cost:</span>
                          <span>{order.shipping_cost} EGP</span>
                        </div>
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Tax:</span>
                          <span>{order.tax} EGP</span>
                        </div>
                        <div className="flex justify-between text-blue-700 font-bold text-base border-t border-blue-200 mt-3 pt-3">
                          <span>Total:</span>
                          <span>{order.total_price} EGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Pagination controls */}
      <div className="flex gap-2 items-center flex-wrap justify-center my-8 w-full">
        <div className="flex gap-2 items-center flex-wrap justify-center mx-auto w-fit bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-3 border border-blue-200 z-40">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {/* Page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded-lg border font-semibold transition ${
                num === page
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100"
              }`}
              onClick={() => setPage(num)}
              disabled={num === page}
            >
              {num}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {/* Add order modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-lg p-8 shadow-lg flex flex-col gap-4 min-w-[350px] max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-2">Add New Order</h2>
            <input
              name="client"
              value={addForm.client || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder="Client ID"
              required
            />
            <input
              name="store"
              value={addForm.store || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder="Store ID"
              required
            />
            <textarea
              name="items"
              value={addForm.items || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder='Items (JSON: [{"item_id":1,"ordered_quantity":2}])'
              required
            />
            <input
              name="shipping_location"
              value={addForm.shipping_location || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder="Shipping Location"
              required
            />
            <select
              name="order_status"
              value={addForm.order_status || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
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
            <select
              name="payment_method"
              value={addForm.payment_method || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
            </select>
            <input
              name="shipping_cost"
              value={addForm.shipping_cost || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder="Shipping Cost"
              type="number"
              step="0.01"
              required
            />
            <input
              name="tax"
              value={addForm.tax || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder="Tax"
              type="number"
              step="0.01"
              required
            />
            <input
              name="total_price"
              value={addForm.total_price || ""}
              onChange={handleAddChange}
              className="border p-2 rounded"
              placeholder="Total Price"
              type="number"
              step="0.01"
              required
            />
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Edit order modal */}
      {editOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn"
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
              onClick={() => setEditOrder(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-7 h-7 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6H3v6z"
                />
              </svg>
              <h2 className="text-2xl font-extrabold text-blue-700 tracking-wide">
                Edit Order Status
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit-status"
                className="font-semibold text-gray-700 mb-1"
              >
                Order Status
              </label>
              <select
                id="edit-status"
                name="order_status"
                value={editForm.order_status || ""}
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
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow transition-all focus:outline-none"
                onClick={() => setEditOrder(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center text-xl font-bold">
            Loading orders...
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center text-red-500 text-xl font-bold">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ClientDetails component ---
function ClientDetails({ client, fetchClientById }) {
  const [clientObj, setClientObj] = React.useState(
    typeof client === "object" ? client : null
  );
  const [userName, setUserName] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;
    if (!clientObj && typeof client === "number") {
      setLoading(true);
      fetchClientById(client).then((data) => {
        if (!ignore) {
          setClientObj(data);
          setLoading(false);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [client, clientObj, fetchClientById]);

  // Fetch user name from users table if not present in clientObj
  React.useEffect(() => {
    let ignore = false;
    async function fetchUserName() {
      if (clientObj && clientObj.user && typeof clientObj.user === "number") {
        try {
          const res = await fetch(
            `https://ahmedmsalah.pythonanywhere.com/users/users/${clientObj.user}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!ignore) setUserName(data.name);
        } catch {}
      } else if (clientObj && clientObj.user && clientObj.user.name) {
        setUserName(clientObj.user.name);
      } else if (clientObj && clientObj.name) {
        setUserName(clientObj.name);
      }
    }
    fetchUserName();
    return () => {
      ignore = true;
    };
  }, [clientObj]);

  if (loading)
    return <span className="text-gray-400 text-xs">Loading client...</span>;
  if (!clientObj)
    return <span className="text-gray-400 text-xs">Unknown client</span>;

  // Prepare image URL
  let imageUrl = clientObj.image_profile;
  if (imageUrl && imageUrl.startsWith("/media")) {
    imageUrl = `http://localhost:8000${imageUrl}`;
  }
  if (!imageUrl) {
    imageUrl = "https://via.placeholder.com/80x80/cccccc/ffffff?text=No+Image";
  }

  return (
    <div className="flex items-center gap-3 mt-1">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <div className="flex flex-col text-xs">
        <span className="font-semibold text-gray-800">
          User: {userName || "-"}
        </span>
        {/* <span className="text-gray-600">{clientObj.email || '-'}</span> */}
        {clientObj.info_disease && (
          <span className="text-gray-500 italic">
            Disease: {clientObj.info_disease}
          </span>
        )}
      </div>
    </div>
  );
}

// --- StoreDetails component ---
function StoreDetails({ store }) {
  const [storeObj, setStoreObj] = React.useState(
    typeof store === "object" ? store : null
  );
  // console.log('StoreDetails store:', store);
  const [loading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  // let ignore = false;
  // async function fetchStore() {
  //   if (!storeObj && typeof store === 'number') {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`https://ahmedmsalah.pythonanywhere.com/medical_stores/${store}/`, {
  //         headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
  //       });
  //       if (!res.ok) return;
  //       const data = await res.json();
  //       console.log('Fetched store:', data);
  //       if (!ignore) setStoreObj(data);
  //     } catch {}
  //     setLoading(false);
  //   }
  // }
  // fetchStore();
  // return () => { ignore = true; };
  // }, [store, storeObj]);

  if (loading)
    return <span className="text-gray-400 text-xs">Loading store...</span>;
  // if (!storeObj) return <span className="text-gray-400 text-xs">Unknown store</span>;

  return (
    <div className="flex flex-col text-xs">
      {/* <span className="text-gray-500">ID: {store.id || 'id issue'}</span> */}
      <span className="font-semibold text-gray-800">
        Name: {store.store_name || "Unnamed Store"}
      </span>
      <span className="text-gray-600">
        Address:{store.store_address || "No address"}
      </span>
    </div>
  );
}

export default OrdersAdminPage;
