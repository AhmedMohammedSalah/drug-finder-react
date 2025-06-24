import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const SummaryStatisticsCard = ({ stats }) => {
  return (
    <div className="rounded-lg shadow bg-white overflow-hidden">
      {/* Header with inline total + title */}
      <div className="bg-blue-600 text-white py-3 px-4 flex items-center gap-3">
        {/* White Circle with Total */}
        <div className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center shadow">
          {stats.total}
        </div>
        <h3 className="text-base font-semibold">Total Requests</h3>
      </div>

      {/* Status Cards */}
      <div className="p-4 space-y-4">
        {/* Pending */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full text-yellow-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Pending</p>
            <p className="text-base font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        {/* Approved */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Approved</p>
            <p className="text-base font-bold text-gray-900">{stats.approved}</p>
          </div>
        </div>

        {/* Rejected */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Rejected</p>
            <p className="text-base font-bold text-gray-900">{stats.rejected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStatisticsCard;
