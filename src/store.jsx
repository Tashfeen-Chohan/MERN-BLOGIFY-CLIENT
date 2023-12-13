import { configureStore } from "@reduxjs/toolkit";
import { categoryApi } from "./features/category/categoryApi";

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaullMiddleware) =>
    getDefaullMiddleware().concat(categoryApi.middleware),
});
