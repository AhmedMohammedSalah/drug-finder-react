import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import pharmacyReducer from '../features/pharmacyslice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pharmacy: pharmacyReducer,
  },
});
