import React, { useEffect, useState, useCallback } from "react";
import Pagination from "../components/shared/pagination";
import SharedLoadingComponent from "../components/shared/medicalLoading";

function DeliveryOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState("available");
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchOrders = useCallback(async () => {
    if (!user?.id || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = view === "available" ? "orders" : "orders/assigned";
      const url = `http://localhost:8000/${endpoint}/?page=${page}&page_size=${pageSize}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();

      setOrders(Array.isArray(data.results) ? data.results : []);
      setTotalPages(data.count ? Math.ceil(data.count / pageSize) : 1);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, token, page, pageSize, view]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderAction = async (orderId, action) => {
    try {
      setLoading(true);
      const endpoint = action === "claim" ? "claim" : "finish";
      const url = `http://localhost:8000/orders/${orderId}/${endpoint}/`;

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to ${action} order`);

      if (action === "claim") {
        setView("assigned");
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setPage(1); // Reset to first page when changing views
  };

  const renderOrderCard = (order) => (
    <div
      key={order.id}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <div className="space-y-2">
        <div className="font-bold text-lg">Order #{order.id}</div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium capitalize">
            {order.order_status.replace("_", " ")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pharmacy:</span>
          <span>{order.store?.name || "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Client:</span>
          <span>{order.client?.user?.name || "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold">
            ${(order.total_with_fees || order.total_price || 0)}
          </span>
        </div>
        {view === "available" ? (
          <button
            onClick={() => handleOrderAction(order.id, "claim")}
            className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            disabled={loading}
          >
            Take Order
          </button>
        ) : (
          order.order_status === "on_process" && (
            <button
              onClick={() => handleOrderAction(order.id, "finish")}
              className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              disabled={loading}
            >
              Mark as Delivered
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Delivery Orders
          </h1>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                view === "available"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleViewChange("available")}
            >
              Available Orders
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                view === "assigned"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleViewChange("assigned")}
            >
              My Orders
            </button>
          </div>
        </div>

        {loading ? (
          <SharedLoadingComponent
            gif="/ordersLoading.gif"
            loadingText="Loading delivery orders..."
            subText="Hang tight, your orders are coming!"
            color="blue"
          />
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {view === "available"
                ? "No available orders in your area"
                : "No assigned orders"}
            </h3>
            <p className="text-gray-500">
              {view === "available"
                ? "Make sure you've set your default location in your profile to see nearby orders."
                : "Claim some orders from the 'Available Orders' tab to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {orders.map(renderOrderCard)}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeliveryOrdersPage;
