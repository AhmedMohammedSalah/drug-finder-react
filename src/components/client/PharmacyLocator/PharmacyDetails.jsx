import {  Phone, ShoppingCart, Clock, Navigation, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PharmacyDetails = ({ pharmacy, onClose }) => {
  if (!pharmacy) return null;

  return (
    <div className="mt-4 md:mt-6 bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
         <img src="images/pharmacy.svg" alt="Pharmacy" className="h-8 w-8 md:h-6 md:w-6 text-amber-500 mr-2" />
         Pharmacy Details
        </h3>
        <button onClick={onClose} className="text-xl text-gray-400 hover:text-gray-600">
         X
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-3 md:space-y-4">
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-gray-800">{pharmacy.store_name}</h4>
            <p className="text-sm text-gray-600 mt-1">{pharmacy.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start text-gray-700">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>{pharmacy.address}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2 flex-shrink-0" />
              <span>{pharmacy.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 mr-2 flex-shrink-0" />
              <span><strong className="font-medium">Hours:</strong> {pharmacy.hours}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Navigation className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 flex-shrink-0" />
              <span><strong className="font-medium">Distance:</strong> {pharmacy.distance?.toFixed(1)} km away</span>
            </div>
            
          </div>
          
          <div className="flex space-x-2 md:space-x-3 pt-2">
            <button
              onClick={() => window.open(`tel:${pharmacy.phone}`, '_self')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base"
            >
              <Phone className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              Call Now
            </button>
            <Link to={`/client/pharmacies/${pharmacy.store_id}`}>
              <button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                Go Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetails;