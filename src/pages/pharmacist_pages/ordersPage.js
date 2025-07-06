import React, { useEffect, useState } from "react";
import Pagination from "../../components/shared/pagination"; //[SENU] CHANGE TO RIGHT ONE
import OrderList from "../../components/shared/order/orderList";
import SharedLoadingComponent from "../../components/shared/medicalLoading";

// Updated order status flow without 'paid' status
const STATUS_FLOW = {
  pending: ["on_process", "canceled"], // Removed "paid" from pending options
  on_process: ["shipping"],
  shipping: ["delivered"],
  delivered: [], // Final state - cannot be canceled
  canceled: [], // Final state
};

function OrdersPage() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const pharmacistId = user ? user.id : null;
  const token = localStorage.getItem("access_token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [clientCache, setClientCache] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    if (!user?.id || !token) return;
    fetch(`http://localhost:8000/medical_stores/?owner_id=${pharmacistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const stores = Array.isArray(data) ? data.results : data.results;
        if (stores && stores.length > 0) {
          setStoreId(stores[0].id);
        } else {
          setStoreId(null);
        }
      })
      .catch(() => setStoreId(null));
  }, [user, token]);

  useEffect(() => {
    if (!storeId || !token) return;
    setLoading(true);
    fetch(
      `http://localhost:8000/orders/?store_id=${storeId}&page=${page}&page_size=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
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
  }, [token, storeId, page, pageSize]);

  useEffect(() => {
    if (!storeId || !token || search.trim() === "") {
      setAllOrders([]);
      return;
    }
    fetch(`http://localhost:8000/orders/?store=${storeId}&page_size=10000`, {
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
  }, [search, token, storeId]);

  const filteredOrders = (search.trim() === "" ? orders : allOrders).filter(
    (order) =>
      ((order.id + "").includes(search) ||
        (order.order_status || "")
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (statusFilter === "" || order.order_status === statusFilter)
  );

  const fetchClientById = async (clientId) => {
    if (!clientId) return "!clientId";
    if (clientCache[clientId]) return clientCache[clientId];
    try {
      const res = await fetch(
        `http://localhost:8000/users/users/${clientId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return "!res.ok";
      const data = await res.json();
      setClientCache((prev) => ({ ...prev, [clientId]: data }));
      return data;
    } catch {
      return "catch";
    }
  };

  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({ order_status: "" });

  const handleEdit = (order) => {
    setEditOrder(order);
    setEditForm({ order_status: "" }); // Reset to empty to force selection
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrder || !editOrder.id || !editForm.order_status) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/orders/${editOrder.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_status: editForm.order_status }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(
          orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
        setEditOrder(null);
      }
    } catch {
      setError("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    if (!currentStatus) return [];
    return STATUS_FLOW[currentStatus] || [];
  };

  const getStatusDisplayName = (status) => {
    const names = {
      pending: "Pending",
      on_process: "On Process",
      shipping: "Shipping",
      delivered: "Delivered",
      canceled: "Canceled",
    };
    return names[status] || status;
  };

  // Check if order can be canceled (not delivered)
  const canCancelOrder = (orderStatus) => {
    return orderStatus === "pending";
  };

  return (
    <div className="relative min-h-screen">
      {loading && (
        <SharedLoadingComponent
          gif="/ordersLoading.gif"
          loadingText="Loading orders data..."
          subText="Hang tight, your orders are coming!"
          color="blue"
        />
      )}

      <div
        className={`container mx-auto px-4 pb-24 ${
          loading || error
            ? "opacity-50 pointer-events-none select-none"
            : "opacity-100"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg p-2 sm:p-4 md:p-6 ${
            loading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-5xl flex flex-col items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-blue-700 drop-shadow">
              Orders
            </h1>
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 bg-white bg-opacity-80 rounded-xl shadow px-2 sm:px-3 md:px-4 py-2 sm:py-3 border border-blue-200 w-full">
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
                  className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base min-w-0"
                />
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-80 rounded-xl shadow px-2 sm:px-3 py-2 border border-blue-200 min-w-[140px] sm:min-w-[180px] mt-2 sm:mt-0">
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
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          {editOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <form
                onSubmit={handleEditSubmit}
                className="bg-white rounded-2xl p-4 sm:p-8 shadow-2xl flex flex-col gap-6 min-w-[90vw] sm:min-w-[350px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-2 border-blue-200 relative animate-fadeIn w-full max-w-md"
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
                    Update Order Status
                  </h2>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Current Status:
                  </h3>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
                    {getStatusDisplayName(editOrder.order_status)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="edit-status"
                    className="font-semibold text-gray-700 mb-1"
                  >
                    Next Status:
                  </label>
                  <div className="space-y-2">
                    {getNextStatusOptions(editOrder.order_status).map(
                      (status) => (
                        <div key={status} className="flex items-center">
                          <input
                            type="radio"
                            id={`status-${status}`}
                            name="order_status"
                            value={status}
                            checked={editForm.order_status === status}
                            onChange={() =>
                              setEditForm({ order_status: status })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="ml-2 block text-gray-900 font-medium"
                          >
                            {getStatusDisplayName(status)}
                          </label>
                        </div>
                      )
                    )}
                  </div>

                  {/* Show Cancel option only if order isn't delivered */}
                  {canCancelOrder(editOrder.order_status) && (
                    <div className="flex items-center mt-2">
                      <input
                        type="radio"
                        id="status-canceled"
                        name="order_status"
                        value="canceled"
                        checked={editForm.order_status === "canceled"}
                        onChange={() =>
                          setEditForm({ order_status: "canceled" })
                        }
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label
                        htmlFor="status-canceled"
                        className="ml-2 block text-red-600 font-medium"
                      >
                        Cancel Order
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4 justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                    disabled={!editForm.order_status}
                  >
                    Update Status
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
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
