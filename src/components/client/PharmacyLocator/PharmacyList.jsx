import { MapPin, AlertCircle, ShoppingCart } from 'lucide-react';
import PharmacyCardLocator from '../../shared/PharmacyCardLocator';

// Update the PharmacyList component
const PharmacyList = ({ 
  pharmacies, 
  loading, 
  error, 
  selectedPharmacy, 
  onPharmacyClick,
  searchTerm,
  onRefreshLocation 
}) => {
  return (
<div className="h-[320px] md:h-[500px] flex flex-col p-4">
      <h4 className="text-sm md:text-base mb-3 md:mb-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-orange-50 border-l-4 border-blue-400 text-blue-700">
        {searchTerm ? (
          <>
            Found <strong className="text-blue-800">{pharmacies.length}</strong> pharmacies with "
            <strong className="text-blue-800">{searchTerm}</strong>" <span className="text-blue-600">(nearest first)</span>
          </>
        ) : (
          <>
            Showing <strong className="text-blue-800">{pharmacies.length}</strong> nearby pharmacies 
            <span className="text-blue-600"> (sorted by distance)</span>
          </>
        )}
      </h4>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 flex flex-col h-full overflow-hidden border border-gray-100">
        <div className="px-2 pb-3 mb-1 border-b border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-2" />
            Nearby Pharmacies
          </h2>
        </div>
        
          <div className="flex-1 overflow-y-auto">

          <div className="h-full overflow-y-auto pr-2 scrollbar-thin 
                        scrollbar-thumb-blue-200 scrollbar-track-blue-50 
                        hover:scrollbar-thumb-blue-300 transition-all 
                        duration-300 scrollbar-thumb-rounded-full">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <button 
                  onClick={onRefreshLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : pharmacies.length === 0 ? (
              <div className="text-center py-6 flex flex-col items-center justify-center h-full">
                <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pharmacies found near you</p>
                <button 
                  onClick={onRefreshLocation}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Refresh Location
                </button>
              </div>
            ) : (
              <div className="space-y-3">
              {pharmacies.map(pharmacy => {
         const firstMedicine = pharmacy.medicines?.[0];
  
            return (
                    <PharmacyCardLocator
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    medicine={firstMedicine}
                    selected={selectedPharmacy?.store_id === pharmacy.store_id}
                    onClick={() => onPharmacyClick(pharmacy)}
                    />
            );
            })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyList;