// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiEndpoints from '../services/api';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const res = await apiEndpoints.cart.getCart();
     console.log('Cart fetched successfully:', res.data);
  return res.data.results[0];// FIX: return the cart object, not res.data[0]
   
  } catch (err) {
    toast.error('Failed to load cart.');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateCartItems = createAsyncThunk(
  'cart/updateItems',
  async ({ cartId, items }, thunkAPI) => {
    try {
      const res = await apiEndpoints.cart.updateItems(cartId, items);
      toast.success('Item quantity updated.');
      return res.data;
    } catch (err) {
      toast.error('Failed to update item.');
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ cartId, product, quantity }, thunkAPI) => {
    try {
      const res = await apiEndpoints.cart.removeItem(cartId, product, quantity);
      toast.success('Item removed.');
      return res.data;
    } catch (err) {
      toast.error('Failed to remove item.');
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (cartId, thunkAPI) => {
  try {
    await apiEndpoints.cart.deleteCart(cartId);
    toast.success('Cart cleared.');
    return null;
  } catch (err) {
    toast.error('Failed to clear cart.');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});



export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const cart = state.cart.cart;
      let res;

      if (!cart) {
        res = await apiEndpoints.cart.createCart({ items: [{ product: product.id, quantity: 1 }] });
      } else {
        const existing = cart.items?.find(i => i.product === product.id);
        const items = existing
          ? cart.items.map(i =>
              i.product === product.id
                ? { product: i.product, quantity: i.quantity + 1 }
                : { product: i.product, quantity: i.quantity }
            )
          : [
              ...cart.items.map(i => ({ product: i.product, quantity: i.quantity })),
              { product: product.id, quantity: 1 },
            ];

        res = await apiEndpoints.cart.updateItems(cart.id, items);
      }

      return res.data;

    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.requires_confirmation) {
        return new Promise((resolve, reject) => {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Cart Replacement</h2>
                  <p className="text-gray-600 mb-6">
                    {errorData.error || 'Your cart contains items from another store. Do you want to clear it and add this product?'}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={async () => {
                        onClose();
                        try {
                          const newRes = await apiEndpoints.cart.createCart({
                            items: [{ product: product.id, quantity: 1 }],
                            force_clear: true,
                          });
                          resolve(newRes.data);
                        } catch (innerErr) {
                          reject(innerErr.response?.data || innerErr.message);
                        }
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Yes, clear & add
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        reject("Action cancelled by user.");
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }
          });
        });
      }

      return thunkAPI.rejectWithValue(errorData || 'Failed to add product to cart.');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default cartSlice.reducer;
