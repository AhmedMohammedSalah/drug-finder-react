import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Minus, ShoppingCart, X, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/cartSlice";

const DEFAULT_MEDICINE_IMAGE = "/defaultMedicineImage.png";

const MedicineCard = ({ medicine = {}, viewMode = "grid", isReadOnly = true }) => {
  const {
    id = "",
    stock = 0,
    brand_name = "",
    generic_name = "",
    chemical_name = "",
    description = "",
    atc_code = "",
    cas_number = "",
    price = 0,
    image = DEFAULT_MEDICINE_IMAGE,
  } = medicine;

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const dispatch = useDispatch();

  const toggleDetailsModal = (e) => {
    e?.stopPropagation();
    console.log("Toggling details modal");
    setShowDetailsModal(!showDetailsModal);
  };

  const handleAddToCart = (e, fromModal = false) => {
    e?.stopPropagation();
    console.log("Handling add to cart, fromModal:", fromModal);
    if (isCartExpanded || fromModal) {
      setIsAdding(true);
      try {
        dispatch(
          addToCart({
            id,
            brand_name,
            generic_name,
            price: Number(price),
            image,
            quantity: Number(quantity),
          })
        );
        toast.success(`${quantity} ${brand_name} added to cart!`);
        setQuantity(1);
        setIsCartExpanded(false);
      } catch (err) {
        toast.error("Failed to add to cart");
      } finally {
        setIsAdding(false);
      }
    } else {
      setIsCartExpanded(true);
    }
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    setIsCartExpanded(false);
    setQuantity(1);
  };

  const incrementQuantity = (e) => {
    e?.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, Number(stock)));
  };

  const decrementQuantity = (e) => {
    e?.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(Number(stock), Number(e.target.value)));
    setQuantity(isNaN(value) ? 1 : value);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={toggleDetailsModal}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={toggleDetailsModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-all"
          aria-label="Close"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
            <img
              src={image}
              alt={brand_name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="py-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {brand_name}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              ${parseFloat(price).toFixed(2)}
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Generic Name
                </h3>
                <p className="text-lg">{generic_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Chemical Name
                </h3>
                <p className="text-lg">{chemical_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Stock
                  </h3>
                  <p
                    className={`text-lg font-medium ${
                      stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stock > 0 ? `${stock} units available` : "Out of stock"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    ATC Code
                  </h3>
                  <p className="text-lg">{atc_code}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    CAS Number
                  </h3>
                  <p className="text-lg">{cas_number}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </h3>
                <p className="text-gray-700 mt-1">
                  {description || "No description available for this medicine."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={toggleDetailsModal}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={stock <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(e, true);
                  toggleDetailsModal();
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Check if portal-root exists before rendering portal
  const portalRoot = document.getElementById("portal-root");

  if (viewMode === "list") {
    return (
      <>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all w-full">
          <div
            className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
            onClick={toggleDetailsModal}
          >
            <img
              src={image}
              alt={brand_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_MEDICINE_IMAGE;
              }}
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={toggleDetailsModal}
                >
                  {brand_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{generic_name}</p>
              </div>
              <span className="text-lg font-semibold text-blue-600 ml-4">
                ${parseFloat(price).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  stock > 10
                    ? "bg-green-100 text-green-800"
                    : stock > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {stock} in stock
              </span>

              <button
                onClick={toggleDetailsModal}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <Info size={14} /> Details
              </button>
            </div>
          </div>
        </div>

        {showDetailsModal &&
          (portalRoot ? (
            createPortal(modalContent, portalRoot)
          ) : (
            console.warn("portal-root element not found, rendering modal without portal"),
            modalContent
          ))}
      </>
    );
  }

  // Grid view
  return (
    <>
      <div className="relative w-full max-w-[280px] bg-white border border-gray-200 rounded-xl pt-10 pb-4 px-4 shadow-md hover:shadow-lg transition-all duration-300 overflow-visible">
        <button
          onClick={toggleDetailsModal}
          className="absolute -top-3 -left-3 w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-lg"
        >
          <Info size={20} />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || stock <= 0}
          className={`absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center rounded-full transition-all ${
            isCartExpanded
              ? "hidden"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          } ${isAdding ? "opacity-70" : ""}`}
          style={{
            clipPath: isCartExpanded ? "" : "circle(75% at 75% 25%)",
          }}
        >
          <ShoppingCart size={20} />
        </button>

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
              max={stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-8 text-center border-t border-b border-gray-200 py-1 text-sm font-medium text-gray-700 focus:outline-none"
            />
            <button
              onClick={incrementQuantity}
              disabled={quantity >= stock}
              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              {isAdding ? "..." : <ShoppingCart size={16} />}
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div
          className="w-full h-40 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer"
          onClick={toggleDetailsModal}
        >
          <img
            src={image}
            alt={brand_name}
            className={`${
              image === "/placeholder.png" ? "w-40 text-center" : "w-full"
            } h-full object-cover transition-transform duration-500 hover:scale-105`}
            onError={(e) => {
              e.target.src = DEFAULT_MEDICINE_IMAGE;
            }}
          />
        </div>

        <div className="space-y-2 cursor-pointer" onClick={toggleDetailsModal}>
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                stock > 10
                  ? "bg-green-100 text-green-800"
                  : stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {stock} in stock
            </span>
            <span className="text-base font-semibold text-blue-600">
              ${parseFloat(price).toFixed(2)}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors">
            {brand_name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{generic_name}</p>
        </div>
      </div>

      {showDetailsModal &&
        (portalRoot ? (
          createPortal(modalContent, portalRoot)
        ) : (
          console.warn("portal-root element not found, rendering modal without portal"),
          modalContent
        ))}
    </>
  );
};

export default MedicineCard;