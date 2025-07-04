import React, { useEffect, useState } from "react";
import Pagination from "../components/shared/pagination";
import OrderList from "../components/shared/order/orderList";
import SharedLoadingComponent from "../components/shared/medicalLoading";

// Updated order status flow without 'paid' status
const STATUS_FLOW = {
  pending: ["on_process", "canceled"], // Removed "paid" from pending options
  on_process: ["shipping", "canceled"],
  shipping: ["delivered", "canceled"],
  delivered: [], // Final state - cannot be canceled
  canceled: [], // Final state
};

function DeliveryOrdersPage() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("access_token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState("available"); // 'available' or 'assigned'

  useEffect(() => {
    if (!user?.id || !token) return;
    setLoading(true);
    let url = `http://localhost:8000/orders/?page=${page}&page_size=${pageSize}`;
    if (view === "available") {
      url += "&delivery__isnull=true&order_status=pending";
    } else {
      url += `&delivery=${user.delivery?.id || user.id}`;
    }
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : data.results || []);
          setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }, [user, token, page, pageSize, view]);

  const claimOrder = async (orderId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/orders/${orderId}/claim/`, {
        method: "POST",
          headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setView("assigned");
      }
    } finally {
      setLoading(false);
    }
  };

  const finishOrder = async (orderId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/orders/${orderId}/finish/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {loading && (
        <SharedLoadingComponent
          gif="/ordersLoading.gif"
          loadingText="Loading delivery orders..."
          subText="Hang tight, your orders are coming!"
          color="blue"
        />
      )}
      <div className="container mx-auto px-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Delivery Orders</h2>
          <div>
            <button
              className={`mr-2 px-4 py-2 rounded ${view === "available" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setView("available")}
            >
              Available Orders
            </button>
            <button
              className={`px-4 py-2 rounded ${view === "assigned" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setView("assigned")}
            >
              My Orders
            </button>
          </div>
              </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded shadow p-4">
              <div className="font-semibold">Order #{order.id}</div>
              <div>Status: {order.order_status}</div>
              <div>Pharmacy: {order.store?.name || "-"}</div>
              <div>Client: {order.client?.user?.name || "-"}</div>
              <div>Total: {order.total_with_fees || order.total_price}</div>
              {view === "available" && (
                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                  onClick={() => claimOrder(order.id)}
                >
                  Take Order
                </button>
              )}
              {view === "assigned" && order.order_status === "on_process" && (
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => finishOrder(order.id)}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
      </div>
    </div>
  );
}

export default DeliveryOrdersPage;
