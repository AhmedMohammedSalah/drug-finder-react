// components/shared/PharmacyCard.jsx
import React from 'react';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Style maps
const bgColorMap = {
  hospital: 'bg-yellow-200',
  clinic: 'bg-sky-200',
  'medical devices': 'bg-purple-200',
  wellness: 'bg-green-200',
  default: 'bg-gray-200'
};

const iconMap = {
  hospital: <BuildingStorefrontIcon className="w-16 h-16 text-white opacity-20" />,
  clinic: <MapPinIcon className="w-16 h-16 text-white opacity-20" />,
  'medical devices': <PhoneIcon className="w-16 h-16 text-white opacity-20" />,
  wellness: <ClockIcon className="w-16 h-16 text-white opacity-20" />,
  default: <BuildingStorefrontIcon className="w-16 h-16 text-white opacity-20" />
};

const getColor = (type) => {
  const key = type?.toLowerCase() || 'default';
  return bgColorMap[key] || bgColorMap.default;
};

const getIcon = (type) => {
  const key = type?.toLowerCase() || 'default';
  return iconMap[key] || iconMap.default;
};

const PharmacyCard = ({ pharmacy }) => {
  const bgColor = getColor(pharmacy.store_type);
  const Icon = getIcon(pharmacy.store_type);

  return (
    <div className={`relative rounded-xl p-6 shadow-md ${bgColor} h-80`}>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{pharmacy.store_name}</h3>
      <p className="text-sm text-gray-700 mb-3">
        {pharmacy.description || 'No description available.'}
      </p>

      {/* Optional: More compact info */}
      <div className="text-xs text-gray-600 space-y-1">
        <p><strong>Type:</strong> {pharmacy.store_type}</p>
        <p><strong>Phone:</strong> {pharmacy.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {pharmacy.address || 'N/A'}</p>
      </div>

      {/* Big faded icon */}
      <div className="absolute bottom-4 right-4">
        {Icon}
      </div>
    </div>
  );
};

export default PharmacyCard;
