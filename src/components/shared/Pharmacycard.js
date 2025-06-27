import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const PharmacyCard = ({ pharmacy }) => {
  return (
    <div className="group relative flex flex-col items-center rounded-xl border border-gray-300 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md mt-">
      {/* Circular Logo - Large and centered */}
      <div className="relative -mt-3 mb-4 h-50 w-50 rounded-full border-4 border-blue-600 bg-white shadow-md">
        {pharmacy.store_logo ? (
          <img 
            src={pharmacy.store_logo} 
            alt={`${pharmacy.store_name} logo`}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="h-full w-full rounded-full bg-blue-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              `;
            }}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>

      {/* Store Name - Single line with truncation */}
      <h3 className="w-full text-xl font-semibold text-gray-900 truncate ">
        {pharmacy.store_name}
      </h3>

      {/* Description - Single line with truncation */}
      {pharmacy.description && (
        <p className="w-full text-sm text-gray-500 truncate mt-1">
          {pharmacy.description}
        </p>
      )}

      {/* Address with icon */}
      {pharmacy.store_address && (
        <div className="mt-4 flex items-center w-full">
          <MapPinIcon className="flex-shrink-0 h-5 w-5 text-blue-600" />
          <p className="ml-2 text-sm text-gray-600 truncate">
            {pharmacy.store_address}
          </p>
        </div>
      )}

      {/* Phone with clickable link */}
      {pharmacy.phone && (
        <div className="mt-2 flex items-center w-full">
          <PhoneIcon className="flex-shrink-0 h-5 w-5 text-blue-600" />
          <a 
            href={`tel:${pharmacy.phone.replace(/\D/g, '')}`}
            className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate"
          >
            {pharmacy.phone}
          </a>
        </div>
      )}

      {/* View Button */}
      <Link
        to={`/pharmacies/${pharmacy.id}`}
        className="mt-6 w-full text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
      >
        View Store
      </Link>
    </div>
  );
};

export default PharmacyCard;