import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrder: null,
  additionalItems: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = { ...action.payload, quantity: 1 };
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.additionalItems = [];
    },
    addToAdditionalItems: (state, action) => {
      const newItem = action.payload;

      if (!newItem || !newItem.food || !newItem.food.name) return;

      if (!Array.isArray(state.additionalItems)) {
        state.additionalItems = [];
      }

      const itemExists = state.additionalItems.find(
        (i) => i.food.name === newItem.food.name
      );

      if (!itemExists) {
        state.additionalItems.push({ ...newItem, quantity: 1 });
      }
    },
    updateAdditionalItemQuantity: (state, action) => {
      const { foodName, type } = action.payload;
      const item = state.additionalItems.find((i) => i.food.name === foodName);
      if (item) {
        if (type === "inc") {
          item.quantity += 1;
        } else if (type === "dec") {
          item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
        }
      }
    },
    removeFromAdditionalItems: (state, action) => {
      state.additionalItems = state.additionalItems.filter(
        (i) => i.food.name !== action.payload
      );
    },
    updateCurrentOrderQuantity: (state, action) => {
      if (state.currentOrder) {
        const type = action.payload;
        if (type === "inc") {
          state.currentOrder.quantity += 1;
        } else if (type === "dec" && state.currentOrder.quantity > 1) {
          state.currentOrder.quantity -= 1;
        }
      }
    },
  },
});

export const {
  setCurrentOrder,
  clearCurrentOrder,
  addToAdditionalItems,
  removeFromAdditionalItems,
  updateAdditionalItemQuantity,
  updateCurrentOrderQuantity,
} = orderSlice.actions;
export default orderSlice.reducer;
