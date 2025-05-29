import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch data
export const fetchPharmacies = createAsyncThunk(
  'pharmacy/fetchPharmacies',
  async () => {
    const response = await fetch('http://localhost:3001/pharmacies');
    return await response.json();
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
        state.error = action.error.message;
      });
  }
});

export default pharmacySlice.reducer;
