import React from 'react';
import { Circle } from 'lucide-react'; // or any icon you prefer

const StatisticsCard = ({ title, count, color = 'bg-gray-100', iconColor = 'text-gray-400' }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-4">
      {/* Colored Circle Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
        <Circle className={`w-5 h-5 ${iconColor}`} />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-semibold text-gray-800">{count}</p>
      </div>
    </div>
  );
};

export default StatisticsCard;
