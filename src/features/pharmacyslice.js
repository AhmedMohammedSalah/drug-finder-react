import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
/*
AUTHOR:Amira,

*/
export const fetchPharmacies = createAsyncThunk(
  'pharmacy/fetchPharmacies',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:3001/pharmacies');
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
