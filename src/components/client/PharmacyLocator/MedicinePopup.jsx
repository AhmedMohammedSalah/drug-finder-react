import { X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const MedicinePopup = ({ 
  medicine, 
  pharmacy, 
  onClose, 
  onAddToCart,
  isAddingToCart
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">{medicine.brand_name}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
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
                <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 font-semibold text-4xl">
                  {medicine.brand_name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                <p className="text-gray-600">{medicine.description || 'No description available'}</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Stock</h4>
                <p className="text-blue-600 font-bold ">{medicine.stock || 'Not available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Price</h4>
                  <p className="text-green-600 font-bold">${parseFloat(medicine.price).toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Available at</h4>
                  <p className="text-gray-600">{pharmacy.store_name}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Pharmacy Info</h4>
                <p className="text-gray-600">{pharmacy.phone}</p>
                <p className="text-gray-600">{pharmacy.hours}</p>
                <p className="text-gray-600">{pharmacy.distance?.toFixed(1)} km away</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onAddToCart}
              disabled={isAddingToCart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinePopup;