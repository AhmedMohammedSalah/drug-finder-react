import React from 'react';
import { MapPin, Phone, FileText, Clock } from 'lucide-react';

const StoreDetailsViewer = ({
  storeName,
  address,
  phone,
  startTime,
  endTime,
  description,
}) => (
  <div className="space-y-4">
    {/* Store name as header */}
    <div>
      <h1 className="text-4xl font-semibold text-gray-800 pl-2">{storeName}</h1>
    </div>

    <div className="bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm relative">
      <MapPin className="absolute top-4 left-4 text-blue-500" size={24} />
      <span className="block">{address}</span>
    </div>

    <div className="bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm relative">
      <Phone className="absolute top-4 left-4 text-blue-500" size={24} />
      <span className="block">{phone}</span>
    </div>

    <div className="flex gap-4">
      <div className="w-1/2 bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm relative">
        <Clock className="absolute top-4 left-4 text-blue-500" size={24} />
        <span className="block">{startTime}</span>
      </div>
      <div className="w-1/2 bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm relative">
        <Clock className="absolute top-4 left-4 text-blue-500" size={24} />
        <span className="block">{endTime}</span>
      </div>
    </div>

    <div className="bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm whitespace-pre-wrap break-words relative">
      <FileText className="absolute top-4 left-4 text-blue-500" size={24} />
      {description}
    </div>
  </div>
);

export default StoreDetailsViewer;