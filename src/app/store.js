import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import pharmacyReducer from '../features/pharmacyslice'; 
import cartReducer from "../features/cart/cartSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    pharmacy: pharmacyReducer,
       cart: cartReducer,
  },
});
