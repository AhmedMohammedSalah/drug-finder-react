import React from 'react';
import IconButton from './btn';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

function ProductCard({ product, categories, onDelete, onEdit }) {
  
  const category = categories.find((cat) => cat._id === product.categoryId) || { name: 'Unknown' };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <img
        className="w-full h-48 object-cover rounded-md mb-4"
        // src={product.images?.length > 0 ? `http://localhost:3001${product.images[0]}` : '../../../public/images/drugCard.jpeg'}
        src="data:image/jpeg;base64,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"
        alt={product.name}
      // onError={(e) => {
      //   e.target.src = '../../../public/images/drugCard.jpeg';
      // }}
      />

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
      <p className="text-gray-700">
        <span className="font-medium">Category:</span> {category.name}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
      </p>
      <div className="mt-4 flex space-x-2">
        <IconButton
          btnColor="red"
          btnShade="500"
          textColor="white"
          hoverShade="600"
          focusShade="400"
          onClick={() => onDelete(product.id)}
          icon={TrashIcon}
          name="Delete"
        />
        <IconButton
          btnColor="green"
          btnShade="500"
          textColor="white"
          hoverShade="600"
          focusShade="400"
          onClick={() => onEdit(product.id)}
          icon={PencilIcon}
          name="Edit"
        />
      
      </div>
    </div>
  );
}

export default ProductCard;