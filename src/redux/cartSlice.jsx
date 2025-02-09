import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [], // Load from localStorage
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: []
  },
  reducers: {
    addToCart: (state, action) => {
        const item = action.payload;
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += 1; // Increase quantity if item exists
        } else {
          state.cart.push({ ...item, quantity: 1 }); // Add new item with quantity 1
        }
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Save to localStorage
    },
    deleteFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Update localStorage
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    }
  }
});

export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;
export const selectTotalItems = (state) =>
    state.cart.cart.reduce((total, item) => total + item.quantity, 0);
export default cartSlice.reducer;
