import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../features/cartSlice';

const DEFAULT_MEDICINE_IMAGE = '/defaultMedicineImage.png'; 

const MedicineCard = ({ medicine, viewMode = 'grid' }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const dispatch = useDispatch();

  // List view layout
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all w-full">
        {/* Medicine image */}
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={medicine.image || DEFAULT_MEDICINE_IMAGE}
            alt={medicine.brand_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_MEDICINE_IMAGE;
            }}
          />
        </div>

        {/* Medicine details */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {medicine.brand_name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {medicine.generic_name}
              </p>
            </div>
            <span className="text-lg font-semibold text-blue-600 ml-4">
              ${parseFloat(medicine.price).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                medicine.stock > 10
                  ? 'bg-green-100 text-green-800'
                  : medicine.stock > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {medicine.stock} in stock
            </span>

            {/* Add to Cart button */}
            <button
              onClick={() => {
               dispatch(addToCart({ product: medicine, quantity }));

                toast.success(`${medicine.brand_name} added to cart!`);
              }}
              disabled={isAdding || medicine.stock <= 0}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                medicine.stock <= 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("medcine", medicine);

  // Default grid view
  return (
    <div className="relative w-full bg-white border border-gray-200 rounded-xl pt-10 pb-4 px-4 shadow-md hover:shadow-lg transition-all duration-300 overflow-visible">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || medicine.stock <= 0}
        className={`absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center rounded-full transition-all ${
          isCartExpanded 
            ? 'hidden'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
        } ${isAdding ? 'opacity-70' : ''}`}
        style={{
          clipPath: isCartExpanded ? '' : 'circle(75% at 75% 25%)'
        }}
      >
        <ShoppingCart size={20} />
      </button>

      {/* Expanded Add to Cart Controls */}
      {isCartExpanded && (
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg border border-gray-200 z-10 flex items-center gap-1">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            min="1"
            max={medicine.stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-8 text-center border-t border-b border-gray-200 py-1 text-sm font-medium text-gray-700 focus:outline-none"
          />
          <button
            onClick={incrementQuantity}
            disabled={quantity >= medicine.stock}
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            {isAdding ? '...' : <ShoppingCart size={16} />}
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Medicine image */}
      <div className="w-full h-40 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <img
          src={medicine.image || DEFAULT_MEDICINE_IMAGE}
          alt={medicine.brand_name}
          // className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          className={`${ medicine.image == '/placeholder.png' ? 'w-40 text-center' : 'w-full'} h-full object-cover transition-transform duration-500 hover:scale-105`}
          onError={(e) => {
            e.target.src = DEFAULT_MEDICINE_IMAGE;
          }}
        />
      </div>

      {/* Medicine details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              medicine.stock > 10
                ? 'bg-green-100 text-green-800'
                : medicine.stock > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {medicine.stock} in stock
          </span>
          <span className="text-base font-semibold text-blue-600">
            ${parseFloat(medicine.price).toFixed(2)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {medicine.brand_name}
        </h3>
        <p className="text-sm text-gray-500 truncate">{medicine.generic_name}</p>
      </div>
    </div>
  );

  // Helper functions
  function handleAddToCart() {
    if (isCartExpanded) {
      setIsAdding(true);
      try {
        const itemToAdd = { ...medicine, quantity };
        dispatch(addToCart(itemToAdd));
        toast.success(`${quantity} ${medicine.chemical_name} added to cart!`, {
          position: 'top-right',
        });
        setQuantity(1);
        setIsCartExpanded(false);
      } catch (err) {
        console.error('Add to cart failed', err);
        toast.error(`Failed to add ${medicine.chemical_name} to cart`, {
          position: 'top-right',
        });
      } finally {
        setIsAdding(false);
      }
    } else {
      setIsCartExpanded(true);
    }
  }

  function handleCancel() {
    setIsCartExpanded(false);
    setQuantity(1);
  }

  function incrementQuantity() {
    setQuantity(prev => Math.min(prev + 1, medicine.stock));
  }

  function decrementQuantity() {
    setQuantity(prev => Math.max(1, prev - 1));
  }

  function handleQuantityChange(e) {
    const value = Math.max(1, Math.min(medicine.stock, Number(e.target.value)));
    setQuantity(isNaN(value) ? 1 : value);
  }
};

export default MedicineCard;