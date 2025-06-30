import React from "react";
import OrderCard from './orderCard';

// [SARA] : Shared OrderList component for admin pages
const OrderList = ({ orders, detailsOrder, setDetailsOrder, handleEdit, fetchClientById }) => {
  if (!orders || orders.length === 0) {
    return <div className="col-span-full text-center text-gray-500 text-lg py-12">No orders found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-5xl">
      {orders.map(order => {
        const isOpen = detailsOrder && detailsOrder.id === order.id;
        return (
          <OrderCard
            key={order.id}
            order={order}
            isOpen={isOpen}
            onToggleDetails={() => setDetailsOrder(isOpen ? null : order)}
            onEdit={() => handleEdit(order)}
            fetchClientById={fetchClientById}
          />
        );
      })}
    </div>
  );
};

export default OrderList;
