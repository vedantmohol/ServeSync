import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrder: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
