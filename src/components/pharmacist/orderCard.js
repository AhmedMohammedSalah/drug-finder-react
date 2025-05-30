import React from 'react';

function OrderCard({ id, patientName, medicationName, quantity, status }) {
  // Map status to Tailwind classes for styling
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const statusClass = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="w-full flex items-center justify-between p-4 rounded-[15px] bg-white border-b border-gray-200 hover:bg-red-50 transition-colors duration-200">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">Order #{id}</div>
        <div className="text-sm text-gray-600 truncate">
          <span className="font-medium">Patient:</span> {patientName}
        </div>
      </div>
      <div className="flex-1 min-w-0 text-sm text-gray-600 truncate">
        <span className="font-medium">Medication:</span> {medicationName}
      </div>
      <div className="flex-1 min-w-0 text-sm text-gray-600">
        <span className="font-medium">Quantity:</span> {quantity}
      </div>
      <div className="flex-1 min-w-0 text-sm">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default OrderCard;