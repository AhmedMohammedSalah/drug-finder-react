{/* [OKS *0-0*]  Product Card changes with grid change */}

const ProductCard = ({ product, viewMode }) => {
  const imageUrl = product.images?.length > 0 
    ? `http://localhost:3001${product.images[0]}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';
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
        alt={product.name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
        }}
      />

      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
          {product.name}
        </h2>
        
        {product.description && (
          <p className="mb-2 text-base dark:text-gray-300 text-gray-700 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center">
          <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          
          {product.originalPrice && (
            <>
              <p className="text-base font-medium text-gray-500 line-through dark:text-gray-300">
                ${product.originalPrice.toFixed(2)}
              </p>
              <p className="ml-auto text-base font-medium text-green-500">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}% off
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;