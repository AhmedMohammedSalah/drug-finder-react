import React from 'react';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Style maps with richer colors
const bgColorMap = {
  hospital: 'bg-gradient-to-br from-yellow-100 to-yellow-300',
  clinic: 'bg-gradient-to-br from-sky-100 to-sky-300',
  'medical devices': 'bg-gradient-to-br from-purple-100 to-purple-300',
  wellness: 'bg-gradient-to-br from-green-100 to-green-300',
  default: 'bg-gradient-to-br from-gray-100 to-gray-300'
};

const textColorMap = {
  hospital: 'text-yellow-800',
  clinic: 'text-sky-800',
  'medical devices': 'text-purple-800',
  wellness: 'text-green-800',
  default: 'text-gray-800'
};

const iconMap = {
  hospital: <BuildingStorefrontIcon className="w-20 h-20 text-white opacity-30" />,
  clinic: <MapPinIcon className="w-20 h-20 text-white opacity-30" />,
  'medical devices': <PhoneIcon className="w-20 h-20 text-white opacity-30" />,
  wellness: <ClockIcon className="w-20 h-20 text-white opacity-30" />,
  default: <BuildingStorefrontIcon className="w-20 h-20 text-white opacity-30" />
};

const getColor = (type) => {
  const key = type?.toLowerCase() || 'default';
  return bgColorMap[key] || bgColorMap.default;
};

const getTextColor = (type) => {
  const key = type?.toLowerCase() || 'default';
  return textColorMap[key] || textColorMap.default;
};

const getIcon = (type) => {
  const key = type?.toLowerCase() || 'default';
  return iconMap[key] || iconMap.default;
};

const PharmacyCard = ({ pharmacy }) => {
  const bgColor = getColor(pharmacy.store_type);
  const textColor = getTextColor(pharmacy.store_type);
  const Icon = getIcon(pharmacy.store_type);

  // Generate random rating for demo purposes
  const rating = Math.round((Math.random() * 2 + 3) * 10) / 10;
  const reviewCount = Math.floor(Math.random() * 100) + 5;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className={`relative rounded-xl p-6 shadow-lg ${bgColor} h-80 flex flex-col overflow-hidden group`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')]"></div>
      
      {/* Logo and top row */}
      <div className="flex justify-between items-start mb-4 z-10">
        {pharmacy.store_logo_url ? (
          <div className="w-16 h-16 rounded-lg bg-white p-1 shadow-sm border border-gray-200 group-hover:scale-105 transition-transform">
            <img
              src={pharmacy.store_logo_url}
              alt={`${pharmacy.store_name} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-white p-3 shadow-sm border border-gray-200 flex items-center justify-center">
            <BuildingStorefrontIcon className="w-8 h-8 text-gray-500" />
          </div>
        )}
        
        <div className="flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold ml-1">{rating}</span>
          <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow z-10">
        <h3 className={`text-xl font-bold ${textColor} mb-2 group-hover:text-opacity-90 transition-colors`}>
          {pharmacy.store_name}
          <ArrowTopRightOnSquareIcon className="w-4 h-4 inline-block ml-1 opacity-0 group-hover:opacity-70 transition-opacity" />
        </h3>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {pharmacy.description || 'No description available.'}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-gray-600" />
            <a 
              href={`tel:${pharmacy.phone}`} 
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-colors"
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
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
        {React.cloneElement(Icon, { className: "w-24 h-24" })}
      </div>
      <div className="absolute bottom-4 right-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300">
        {Icon}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-xl"></div>
    </motion.div>
  );
};

export default PharmacyCard;