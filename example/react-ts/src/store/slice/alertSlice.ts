import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";
import { AlertItem } from "src/types/alert.type";

interface InitialState {
  stack: AlertItem[];
}

const initialState: InitialState = {
  stack: [],
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    add: (state, { payload }: PayloadAction<AlertItem>) => {
      state.stack = [payload, ...state.stack];
    },
    del: (state, { payload }: PayloadAction<number>) => {
      state.stack = state.stack.filter((_, i) => i !== payload);
    },
    clear: (state) => {
      if (!state.stack.length) return;

      while (state.stack.length) {
        state.stack = state.stack.filter((_, i) => i !== 0)
      }
    },
  },
});

export const { add, del, clear } = alertSlice.actions;

export const selectAlert = (state: RootState) => state.alertSlice.stack;

export default alertSlice.reducer;
