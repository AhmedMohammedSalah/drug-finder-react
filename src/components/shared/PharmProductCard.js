import React from "react";
import IconButton from "./btn";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

function ProductCard({ product, categories, onDelete, onEdit }) {
  // Safely destructure product with defaults
  const {
    id = "",
    name = "",
    price = 0,
    categoryId = "",
    images = [],
  } = product || {};

  // Find category with null checks
  const category = (categories || []).find((cat) => cat._id === categoryId) || {
    name: "Unknown",
  };

  // Handle image source with fallback
  const imageSrc =
    images?.length > 0
      ? `http://localhost:3001${images[0]}`
      : "/images/drugCard.jpeg";

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <img
        className="w-full h-48 object-cover rounded-md mb-4"
        src={imageSrc}
        alt={name}
        onError={(e) => {
          e.target.src = "/images/drugCard.jpeg";
        }}
      />

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-700">
        <span className="font-medium">Category:</span> {category.name}
      </p>
      <p className="text-gray-700">
        {/* <span className="font-medium">Price:</span> ${product.price} */}
        <span className="font-medium">Price:</span> ${price.toFixed(2)}
      </p>

      <div className="mt-4 flex space-x-2">
        <IconButton
          btnColor="red"
          btnShade="500"
          textColor="white"
          hoverShade="600"
          focusShade="400"
          onClick={() => onDelete(id)}
          icon={TrashIcon}
          name="Delete"
        />
        <IconButton
          btnColor="green"
          btnShade="500"
          textColor="white"
          hoverShade="600"
          focusShade="400"
          onClick={() => onEdit(id)}
          icon={PencilIcon}
          name="Edit"
        />
      </div>
    </div>
  );
}

export default ProductCard;
