import React from 'react';
import { MapPin, Navigation, Phone, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
const PharmacyCardLocator = ({ pharmacy, selected, onClick, getDirections }) => {
  return (
    <div 
      className={`bg-white rounded-xl p-3 mb-3 cursor-pointer transition-all duration-200 group ${
        selected ? 'ring-1 ring-blue-400 shadow-sm' : 'shadow-xs hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Pharmacy Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            <img
              src={pharmacy.store_logo_url}
              alt={pharmacy.store_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center bg-blue-50">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Pharmacy Info */}
        <div className="flex-1 min-w-0">
          {/* Name + Rating */}
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {pharmacy.store_name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {pharmacy.rating?.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          {pharmacy.description && (
            <p className="text-sm text-gray-500 mb-2 truncate">
              {pharmacy.description}
            </p>
          )}

          {/* Address + Distance */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="truncate flex-1">{pharmacy.address}</span>
            <span className="ml-2 text-sm font-medium text-blue-600 whitespace-nowrap">
              {pharmacy.distance?.toFixed(1)} km
            </span>
          </div>

          {/* Hours + Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <span>{pharmacy.hours}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${pharmacy.phone}`, '_self');
                }}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition"
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </button>
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCardLocator;
