import { ShoppingCart, Navigation } from 'lucide-react';
import { addToCart } from '../../features/cartSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MedicinePopup from '../client/PharmacyLocator/MedicinePopup';
import toast, { Toaster } from 'react-hot-toast';


const PharmacyCardLocator = ({ 
  pharmacy, 
  selected, 
  onClick,
  medicine
}) => {
  const [adding, setAdding] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState(null);


  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();
    if (!medicine?.id) {
      console.error('Invalid medicine:', medicine);
      toast.error('Invalid medicine');

      return;
    }

    setAdding(true);
    try {
      await dispatch(addToCart({
        ...medicine,
        pharmacy_id: pharmacy.store_id,
        pharmacy_name: pharmacy.store_name
      })).unwrap();
      toast.success(`${medicine.brand_name} added to cart successfully!`)
    } catch (err) {
      console.error('Add to cart failed:', err);
      toast.error(err.message || 'Failed to add item to cart');
      ;

    } finally {
      setAdding(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setShowMedicineModal(true);
  };

  return (
    <>
      <div 
        className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer mb-4 last:mb-0 w-full ${
          selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-md mr-3 flex items-center justify-center bg-gray-100 overflow-hidden">
              {pharmacy.store_logo_url ? (
                <img 
                  src={pharmacy.store_logo_url} 
                  alt={pharmacy.store_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="hidden w-full h-full items-center justify-center bg-gray-200 text-gray-600 font-medium text-xs">
                {pharmacy.store_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800">{pharmacy.store_name}</h3>
              <div className="mt-1 text-sm text-gray-600">
                {pharmacy.phone && <p>{pharmacy.phone}</p>}
                {pharmacy.hours && <p className="mt-1">{pharmacy.hours}</p>}
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Navigation className="h-4 w-4 text-blue-500 mr-1.5" />
                <span className="text-sm">Distance: {pharmacy.distance?.toFixed(1)} km away</span>
              </div>
            </div>
          </div>
          <Link 
            className="text-blue-600 text-sm font-medium hover:text-blue-800"
            to={`/client/pharmacies/${pharmacy.store_id}`}
            onClick={(e) => e.stopPropagation()}
          >
            view
          </Link>
        </div>

        {medicine && (
          <>
            <div className="my-4 border-t border-gray-100"></div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                {medicine.image ? (
                  <img 
                    src={medicine.image} 
                    alt={medicine.brand_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 font-semibold text-lg">
                  {medicine.brand_name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg text-gray-900 mb-2 break-words hyphens-auto">
                  <span className="line-clamp-2">{medicine.brand_name}</span>
                </h4>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 break-words hyphens-auto">
                  <span className="line-clamp-2">{medicine.description}</span>
                </p>
                <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full border border-green-700">
                  ${parseFloat(medicine.price).toFixed(2)}
                </span>
                
                <div className="flex items-center justify-between gap-3 mt-3">
                  <button 
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200 flex-shrink-0"
                    onClick={handleViewDetails}
                  >
                    View Details
                  </button>
                  
                  <button 
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showMedicineModal && medicine && (
        <MedicinePopup
          medicine={medicine}
          pharmacy={pharmacy}
          onClose={() => setShowMedicineModal(false)}
          onAddToCart={handleAddToCart}
          isAddingToCart={adding}
        />
      )}
 
    </>
  );
};

export default PharmacyCardLocator;