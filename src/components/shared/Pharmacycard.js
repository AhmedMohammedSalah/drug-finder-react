import React from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Optional: text color map (for store type)
const textColorMap = {
  hospital: "text-yellow-800",
  clinic: "text-sky-800",
  "medical devices": "text-purple-800",
  wellness: "text-green-800",
  default: "text-blue-800",
};

const iconMap = {
  hospital: <BuildingStorefrontIcon className="w-24 h-24 text-yellow-100" />,
  clinic: <MapPinIcon className="w-24 h-24 text-sky-100" />,
  'medical devices': <PhoneIcon className="w-24 h-24 text-purple-100" />,
  wellness: <ClockIcon className="w-24 h-24 text-green-100" />,
  default: <BuildingStorefrontIcon className="w-24 h-24 text-gray-200" />
};

const getTextColor = (type) => textColorMap[type?.toLowerCase()] || textColorMap.default;
const getIcon = (type) => iconMap[type?.toLowerCase()] || iconMap.default;

const PharmacyCard = ({ pharmacy }) => {
  const textColor = getTextColor(pharmacy.store_type);
  const Icon = getIcon(pharmacy.store_type);

  const rating = Math.round((Math.random() * 2 + 3) * 10) / 10;
  const reviewCount = Math.floor(Math.random() * 100) + 5;

  return (
    <Link to="/client/PharmacyPage" className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15)' }}
        className="relative rounded-2xl p-6 shadow-lg bg-white h-96 flex flex-col overflow-hidden group transition-all duration-300"
      >
        {/* Top section: Logo and rating */}
        <div className="flex justify-between items-start mb-5 z-10">
          {pharmacy.store_logo_url ? (
            <div className="w-20 h-20 rounded-xl bg-white p-2 shadow-md border border-gray-200 group-hover:scale-105 transition-transform">
              <img
                src={pharmacy.store_logo_url}
                alt={`${pharmacy.store_name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-white p-4 shadow-md border border-gray-200 flex items-center justify-center">
              <BuildingStorefrontIcon className="w-10 h-10 text-gray-500" />
            </div>
          )}

          <div className="flex items-center bg-gray-50/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold ml-1">{rating}</span>
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow z-10">
          <h3 className={`text-2xl font-bold ${textColor} mb-2 group-hover:text-opacity-90 transition-colors`}>
            {pharmacy.store_name}
          </h3>

          <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
            {pharmacy.description || 'No description available.'}
          </p>

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-gray-600" />
              <a
                href={`tel:${pharmacy.phone}`}
                className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {pharmacy.phone || 'N/A'}
              </a>
            </div>

            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-600 mt-0.5" />
              <span className="text-sm text-gray-700 flex-1">
                {pharmacy.address || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Background icon */}
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
          {React.cloneElement(Icon, { className: "w-28 h-28" })}
        </div>

        <div className="absolute bottom-5 right-5 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300">
          {Icon}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-xl"></div>
      </motion.div>
    </Link>
  );
};

export default PharmacyCard;
