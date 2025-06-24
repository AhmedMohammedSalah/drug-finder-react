import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import pharmacyReducer from '../features/pharmacyslice'; 
<<<<<<< HEAD
import cartReducer from "../features/cartSlice"
=======
import cartReducer from "../features/cart/cartSlice"
import notificationReducer from "../features/notificationSlice"
>>>>>>> 124d9c8 (Notification Done)
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
