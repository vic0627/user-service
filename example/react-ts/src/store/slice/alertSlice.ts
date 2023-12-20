import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";
import delay from "../../utils/delay";
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
    clear: (state, { payload }: PayloadAction<() => void>) => {
      if (!state.stack.length) return;

      const t = setInterval(() => {
        if (!state.stack.length) {
          payload();
          clearInterval(t);
        }
        console.log("calling~");

        state.stack = state.stack.filter((_, i) => i !== 0);
      }, 100);
    },
  },
});

export const { add, del, clear } = alertSlice.actions;

export const selectAlert = (state: RootState) => state.alertSlice.stack;

export default alertSlice.reducer;
