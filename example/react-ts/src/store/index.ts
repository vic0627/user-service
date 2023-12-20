import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./slice/alertSlice";

export const store = configureStore({
  reducer: {
    alertSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
