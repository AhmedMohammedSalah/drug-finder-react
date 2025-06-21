import IconButton from '../shared/btn';
import apiEndpoints from '../../services/api';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';

{/* [OKS *0-0*]  Product Card changes with grid change */}


const ProductCard = ({ product, viewMode, loading }) => {
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch();
  const imageUrl = product.image
    ? `http://localhost:8000/inventory/medicines/${product.image}` // or the correct media URL
    : 'https://via.placeholder.com/300x200?text=No+Image';

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await dispatch(addToCart(product));
    } catch (err) {
      console.error('Add to cart failed', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={`mx-auto transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-blue-500 ${
      viewMode === 'grid' ? 'w-50 h-100' : 'w-full flex max-w-3xl'
    }`}>
      <img 
        className={viewMode === 'grid' 
          ? 'h-48 w-full object-cover object-center' 
          : 'h-48 w-64 object-cover object-center'
        }
        src={imageUrl}
        alt={product.generic_name || product.brand_name || 'Medicine'}
        onError={(e) => {
          if (e.target.src !== 'https://via.placeholder.com/300x200?text=Image+Not+Found') {
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
          }
        }}
      />
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''} relative`}>
        <h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
          {product.generic_name}
        </h2>
         <p className="mb-1 text-base text-gray-700 dark:text-gray-300">
          <span className="font-semibold">store_id:</span> {product.store}
        </p>
        <p className="mb-1 text-base text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Brand:</span> {product.brand_name}
        </p>
        {/* <p className="mb-1 text-base text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Chemical:</span> {product.chemical_name}
        </p> */}
        {product.description && (
          <p className="mb-2 text-base dark:text-gray-300 text-gray-700 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center mt-2">
          <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
            ${product.price}
          </p>
        </div>
        <br />
        <div className="absolute bottom-4 right-4 z-10">
          <IconButton
            btnColor="blue"
            btnShade={500}
            hoverShade={600}
            focusShade={400}
            textColor="white"
            text={adding ? 'Adding...' : 'Add to Cart'}
            onClick={handleAddToCart}
            disabled={adding}
          />
        </div>
      </div>
    </div>
  );
};


export default ProductCard;