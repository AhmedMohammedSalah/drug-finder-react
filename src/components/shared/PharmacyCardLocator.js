import React from "react";
import { MapPin, Phone, Clock, Star } from "lucide-react";
{/* [OKS *0-0*]  PharmacyCardLocator component*/}

const PharmacyCardLocator = ({
  pharmacy,
  selected,
  onClick,
  getDirections,
  showActions = true,
}) => (
  <div
    className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
      selected ? "ring-2 ring-blue-500" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-semibold text-lg text-gray-800">
        {pharmacy.store_name}
      </h3>
      <div className="flex items-center text-yellow-500">
        <Star className="h-4 w-4 fill-current" />
        <span className="text-sm text-gray-600 ml-1">{pharmacy.rating}</span>
      </div>
    </div>
    <p className="text-gray-600 text-sm mb-3">{pharmacy.description}</p>
    <div className="space-y-2 text-sm">
      <div className="flex items-center text-gray-500">
        <MapPin className="h-4 w-4 mr-2" />
        <span>
          {pharmacy.distance !== undefined
            ? `${pharmacy.distance.toFixed(1)} km away`
            : "Distance unknown"}
        </span>
      </div>
      <div className="flex items-center text-gray-500">
        <Clock className="h-4 w-4 mr-2" />
        <span>{pharmacy.hours}</span>
      </div>
      <div className="flex items-center text-gray-500">
        <Phone className="h-4 w-4 mr-2" />
        <span>{pharmacy.phone}</span>
      </div>
    </div>
    {showActions && (
      <div className="mt-4 flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            getDirections(pharmacy);
          }}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Get Directions
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(`tel:${pharmacy.phone}`, "_self");
          }}
          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Call Now
        </button>
      </div>
    )}
  </div>
);

export default PharmacyCardLocator;