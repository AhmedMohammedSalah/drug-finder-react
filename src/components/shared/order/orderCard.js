import React from "react";
import ReceiptOrder from './reciptOrder';

// [SARA] : Shared OrderCard component for admin pages
const OrderCard = ({ order, isOpen, onToggleDetails, onEdit, fetchClientById }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 hover:shadow-xl transition-shadow duration-200 w-full col-span-full">
    <div className="flex flex-row items-center gap-3">
      <div className="flex-1 flex flex-col gap-2">
        <div className="font-bold text-xl text-blue-800 flex items-center gap-2">
          <span className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold">Order #{order.id}</span>
        </div>
        <div className="text-gray-700 flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <span className={
            `px-2 py-1 rounded text-xs font-bold ` +
            (order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
            order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            order.order_status === 'paid' ? 'bg-blue-100 text-blue-700' :
            order.order_status === 'on_process' ? 'bg-purple-100 text-purple-700' :
            order.order_status === 'shipping' ? 'bg-orange-100 text-orange-700' :
            order.order_status === 'canceled' ? 'bg-red-100 text-red-700' :
            'bg-gray-200 text-gray-700')
          }>{order.order_status}</span>
        </div>
        <div className="text-sm text-blue-600 font-semibold">Subtotal: {order.total_price} EGP</div>
        <div className="text-lg text-blue-600 font-semibold">Total: {order.total_with_fees} EGP</div>
      </div>
      <div className="flex flex-col gap-2 items-end ml-4 min-w-[120px]">
        <button
          className={`flex items-center justify-center gap-2 ${isOpen ? 'bg-gray-500 hover:bg-gray-700' : 'bg-blue-500 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg shadow-md transition font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 active:scale-95 duration-100`}
          onClick={onToggleDetails}
        >
          {isOpen ? 'Hide Details' : 'Show Details'}
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 active:scale-95 duration-100"
          onClick={onEdit}
        >
          Edit Status
        </button>
      </div>
    </div>
    {isOpen && (
      <ReceiptOrder order={order} fetchClientById={fetchClientById} />
    )}
  </div>
);

export default OrderCard;
