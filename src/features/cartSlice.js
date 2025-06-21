// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiEndpoints from '../services/api';
import { toast } from 'react-toastify';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const res = await apiEndpoints.cart.getCart();
    return res.data[0];
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
      // Get current cart from state
      const state = thunkAPI.getState();
      const cart = state.cart.cart;
      let res;
      if (!cart) {
        // If no cart, create a new one with this product
        res = await apiEndpoints.cart.createCart({ items: [{ product: product.id, quantity: 1 }] });
      } else {
        // If cart exists, add or update the product in the cart
        // Check if product already in cart
        const existing = cart.items?.find(i => i.product === product.id);
        let items;
        if (existing) {
          // Update quantity
          items = cart.items.map(i =>
            i.product === product.id
              ? { product: i.product, quantity: i.quantity + 1 }
              : { product: i.product, quantity: i.quantity }
          );
        } else {
          // Add new product
          items = [
            ...cart.items.map(i => ({ product: i.product, quantity: i.quantity })),
            { product: product.id, quantity: 1 },
          ];
        }
        res = await apiEndpoints.cart.updateItems(cart.id, items);
      }
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to add to cart');
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
      });
  },
});

export default cartSlice.reducer;
