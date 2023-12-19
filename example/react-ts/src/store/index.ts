import { configureStore } from "@reduxjs/toolkit";
import ruleErrorSlice from "./slice/ruleErrorSlice";

export const store = configureStore({
  reducer: {
    ruleErrorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
