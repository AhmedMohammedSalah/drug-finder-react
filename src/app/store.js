import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import pharmacyReducer from '../features/pharmacyslice'; 
import cartReducer from "../features/cartSlice"
import notificationReducer from "../features/notificationSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    pharmacy: pharmacyReducer,
    cart: cartReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
