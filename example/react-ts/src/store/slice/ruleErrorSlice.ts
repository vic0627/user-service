import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";
import type { UniqueRuleError } from "../../types/product.type";
import delay from "../../utils/delay";

interface InitialState {
  errors: UniqueRuleError[];
}

const initialState: InitialState = {
  errors: [],
};

export const ruleErrorSlice = createSlice({
  name: "ruleError",
  initialState,
  reducers: {
    add: (state, { payload }: PayloadAction<UniqueRuleError>) => {
      state.errors = [payload, ...state.errors];
    },
    del: (state, { payload }: PayloadAction<number>) => {
      state.errors = state.errors.filter((_, i) => i !== payload);
    },
    clear: (state) => {
      (async () => {
        while (state.errors.length) {
          await delay(() => {
            state.errors.shift();
          }, 100);
        }
      })();
    },
  },
});

export const { add, del, clear } = ruleErrorSlice.actions;

export const selectRuleError = (state: RootState) => state.ruleErrorSlice.errors;

export default ruleErrorSlice.reducer;
