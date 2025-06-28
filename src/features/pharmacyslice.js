import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiEndpoints from '../services/api';

export const fetchPharmacies = createAsyncThunk(
  'pharmacy/fetchPharmacies',
  async (params = {}, thunkAPI) => {
    try {
      const { search, page, store_type } = params;

      const config = {
        params: {
          page,
        },
      };

      if (search) config.params.search = search;
      if (store_type) config.params.store_type = store_type;

      const response = await apiEndpoints.pharmacies.getAllPharmacies(config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPharmacies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPharmacies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPharmacies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default pharmacySlice.reducer;
