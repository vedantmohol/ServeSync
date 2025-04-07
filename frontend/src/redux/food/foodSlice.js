import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  successMessage: null,
  errorMessage: null,
  loading: false,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addFoodStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    addFoodSuccess: (state, action) => {
      state.loading = false;
      state.successMessage = action.payload;
      state.errorMessage = null;
    },
    addFoodFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
      state.successMessage = null;
    },
    clearFoodMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
});

export const {
  addFoodStart,
  addFoodSuccess,
  addFoodFailure,
  clearFoodMessages,
} = foodSlice.actions;

export default foodSlice.reducer;
