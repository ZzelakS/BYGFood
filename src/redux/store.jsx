import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import cartSlice from "./cartSlice";

// Persist configuration
const persistConfig = {
    key: "root", // Key for the persisted state
    storage, // Use localStorage
  };
  
  // Create a persisted reducer
  const persistedReducer = persistReducer(persistConfig, cartSlice);
  
  // Configure the Redux store
  const store = configureStore({
    reducer: {
      cart: persistedReducer, // Use the persisted reducer for the cart
    },
  });
  
  // Create a persistor object
  export const persistor = persistStore(store);
  
  export default store;
  