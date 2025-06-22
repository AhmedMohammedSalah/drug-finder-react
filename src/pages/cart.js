// src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateCartItems,
  removeCartItem,
  clearCart,
} from '../features/cartSlice';
import IconButton from '../components/shared/btn';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    console.log('Cart state:', cart);
  }, [cart]);

const handleQuantityChange = (productId, change) => {
  if (!cart) return;

  dispatch(updateCartItems({
    cartId: cart.id,
    items: [{ product: productId, quantity: change }],
  }));
};


  const handleRemove = (productId) => {
    if (!cart) return;
    dispatch(removeCartItem({
      cartId: cart.id,
      product: productId,
    }));
  };

  const handleClearCart = () => {
    if (!cart) return;
    dispatch(clearCart(cart.id));
  };

  if (status === 'loading') return <p>Loading cart...</p>;
  if (!cart || !cart.items?.length) return <p>Your cart is empty.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">🛒 Shopping Cart</h2>
      {cart.items.map((item) => (
        <div
          key={item.product}
          className="flex items-center justify-between border p-4 mb-2 rounded shadow-sm"
        >
          <div>
            <h3 className="text-md font-bold">Product #{item.product}</h3>
            <p className="text-sm">Quantity: {item.quantity}</p>
            <p className="text-sm">Price: {item.price} Eg</p>
          </div>
          <div className="flex gap-2 items-center">
            <IconButton text={"+"} onClick={() => handleQuantityChange(item.product, 1)} />
            <IconButton text={"-"} onClick={() => handleQuantityChange(item.product, -1)} />
            <IconButton text={"🗑️"} onClick={() => handleRemove(item.product)} />
          </div>
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <p>Shipping Cost: {cart.shipping_cost} Eg</p>
        <p>Tax: {cart.tax} Eg</p>
        <p className="font-bold text-lg">Total: {cart.total_price} Eg</p>
        <IconButton text={"🧹 Clear Cart"} onClick={handleClearCart} />
      </div>
        {/*[OKS] add a checkout button */}
      <div className="border-t pt-4 mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
