import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPharmacies = createAsyncThunk(
  'pharmacy/fetchPharmacies',
  async (params = {}, thunkAPI) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await axios.get(`http://localhost:8000/medical_stores/?${query}`);
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
