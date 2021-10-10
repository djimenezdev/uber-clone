import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/NavSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
  },
});
