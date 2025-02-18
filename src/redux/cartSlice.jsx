import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [], // Load from localStorage
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
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
      const filteredCart = state.cart.filter(item => item.id !== action.payload.id);
    
      // Ensure the new state is serializable
      state.cart = filteredCart.map(item => ({
        ...item,
        time: item.time?.toDate?.() || null, // Convert Firestore Timestamp
      }));
    
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity === 0) {
        state.cart = state.cart.filter((i) => i.id !== id); // Remove if quantity is 0
      }
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Update localStorage
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  }
});

export const { addToCart, deleteFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const selectTotalItems = (state) =>
  state.cart.cart.reduce((total, item) => total + item.quantity, 0);
export default cartSlice.reducer;
