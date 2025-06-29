import { ShoppingCart, Navigation } from 'lucide-react';
import { addToCart } from '../../features/cartSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PharmacyCardLocator = ({ 
  pharmacy, 
  selected, 
  onClick,
  medicine
}) => {
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch();
const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!medicine?.id) {
      console.error('Invalid medicine:', medicine);
      return;
    }

    setAdding(true);
    try {
      await dispatch(addToCart({
        ...medicine,
        pharmacy_id: pharmacy.store_id,
        pharmacy_name: pharmacy.store_name
      })).unwrap();
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer mb-3 last:mb-0 ${
        selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300 bg-white'
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

      {medicine ? (
        <>
          <div className="my-3 border-t border-gray-200"></div>
          <div className="flex">
            <div className="w-16 h-16 rounded-md mr-3 flex items-center justify-center bg-gray-100 overflow-hidden">
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
              <div className="hidden w-full h-full items-center justify-center bg-gray-200 text-gray-600 font-medium text-sm">
                {medicine.brand_name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-base text-gray-800">{medicine.brand_name}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{medicine.description}</p>
              <div className="flex items-center justify-between mt-4">
                <button 
                  className="text-blue-600 text-sm font-medium hover:text-blue-800 pl-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  View All Details
                </button>
                <div className="flex items-center space-x-4">
                   <div className="flex justify-between items-center mt-3">
                        < span className="ml-auto inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                         ${parseFloat(medicine.price).toFixed(2)}
                        </span>

                  </div>
                  <button 
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-lg"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? 'Adding...' : <><ShoppingCart className="h-5 w-5 mr-1" /> Add</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-3 text-sm text-gray-500">
        </div>
      )}
    </div>
  );
};

export default PharmacyCardLocator;
