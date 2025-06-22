// src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateCartItems,
  removeCartItem,
  clearCart,
} from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';
import IconButton from '../components/shared/btn';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    console.log('Cart state:', cart);
  }, [cart]);

  const handleQuantityChange = (productId, change) => {
    if (!cart) return;

    dispatch(
      updateCartItems({
        cartId: cart.id,
        items: [{ product: productId, quantity: change }],
      })
    );
  };

  const handleRemove = (productId) => {
    if (!cart) return;
    dispatch(
      removeCartItem({
        cartId: cart.id,
        product: productId,
      })
    );
  };

  const handleClearCart = () => {
    if (!cart) return;
    dispatch(clearCart(cart.id));
  };

  if (status === 'loading') return <p>Loading cart...</p>;
  
  if (!cart || !cart.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          You haven't added any products to your cart yet.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cart Title */}
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Table */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
              <div className="col-span-2">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Subtotal</div>
              <div className="text-center">Action</div>
            </div>

            {/* Cart Items */}
            {cart.items.map((item) => (
              <div key={item.product} className="grid grid-cols-6 gap-4 p-4 border-b items-center hover:bg-gray-50">
                {/* Product Info */}
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.medicine_image ? (
                      <img 
                        src={item.medicine_image} 
                        alt={item.medicine_name || `Product ${item.product}`}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gray-200 rounded-lg items-center justify-center text-gray-400 text-xs ${item.medicine_image ? 'hidden' : 'flex'}`}>
                      
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.name || `Medicine #${item.product}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {item.product}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center">
                  <span className="font-medium">${item.price}</span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product, -1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product, 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-center">
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                {/* Remove Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleRemove(item.product)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart Button */}
          <div className="mt-4">
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Totals Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-6">Cart totals</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cart.subtotal || cart.total_price}</span>
              </div>
              
              {cart.shipping_cost > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${cart.shipping_cost}</span>
                </div>
              )}
              
              {cart.tax > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${cart.tax}</span>
                </div>
              )}
              
              <div className="flex justify-between py-3 text-lg font-bold border-t-2">
                <span>Total</span>
                <span>${cart.total_price}</span>
              </div>
            </div>

           
            {/* Checkout Button */}
            <button className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;