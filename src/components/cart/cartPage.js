import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../features/cart/cartSlice';
import { ShoppingCart, X, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function CartPage() {
  const { items, deliveryAddress } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="text-blue-600" size={24} />
          Your Cart
        </h1>
        {/* {items.length > 0 && (
          <button 
            onClick={() => dispatch(clearCart())}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        )} */}
      </div>

      {/* Delivery Address */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
      >
        <div className="flex items-center justify-end gap-2 mb-2">
          <MapPin className="text-blue-600" size={18} />
          <h2 className="text-lg font-semibold">Delivery To</h2>
        </div>
        <p className="text-right text-gray-700 font-medium">{deliveryAddress || 'No address selected'}</p>
        <button className="mt-5 text-sm text-blue-600 hover:text-blue-800 float-right">
          Change Address
        </button>
      </motion.div>

      {/* Products List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span>Your Items</span>
          <span className="text-sm text-gray-500">{items.length} item(s)</span>
        </h2>
        
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <ShoppingCart className="text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Continue Shopping
              </button>
            </motion.div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <motion.li 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="text-right">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <span className="w-12 p-1 border rounded text-center my-1">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-6 rounded-lg border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">${(totalPrice + 5).toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg">
            Proceed to Checkout
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">
            Free delivery on orders over $50
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default CartPage;