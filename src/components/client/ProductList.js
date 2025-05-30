import axios from 'axios';
import { useState, useEffect } from 'react';
import ProductCard from '../shared/ProductCard';

const ProductList = ({ viewMode, toggleViewMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const sortedProducts = products;


  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center py-8">Loading products...</div>
    </div>
  );


  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-red-500 text-center py-8">Error: {error}</div>
    </div>
  );

  return (
    <div className="w-full lg:w-3/4 min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
        <div className="flex justify-between mb-6 items-center">
          <span className="text-blue-600 font-medium">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </span>
          <div className="flex gap-4">
            <select
              className="border border-blue-500 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
              
            >
              <option value="latest">Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="flex gap-1 bg-gray-100 p-1 rounded">
              <button 
                onClick={() => toggleViewMode("grid")}
                className={`p-2 rounded transition-colors ${viewMode === "grid" 
                  ? "bg-white shadow text-blue-600" 
                  : "text-gray-500 hover:bg-gray-200"}`}
                aria-label="Grid view"
              >
                <i className="fas fa-th-large text-sm"></i>
              </button>
              <button 
                onClick={() => toggleViewMode("list")}
                className={`p-2 rounded transition-colors ${viewMode === "list" 
                  ? "bg-white shadow text-blue-600" 
                  : "text-gray-500 hover:bg-gray-200"}`}
                aria-label="List view"
              >
                <i className="fas fa-list-ul text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-6"
        }>
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className={
                viewMode === "grid" 
                  ? "w-full mx-auto transform transition-all hover:-translate-y-1" 
                  : "w-full"
              }
            >
              <ProductCard 
                product={product}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;