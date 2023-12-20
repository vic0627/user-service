import { MenuItem, TextField } from "@mui/material";
import { ChangeEventHandler, Reducer, useEffect, useReducer, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { selectRuleError } from "../store/slice/ruleErrorSlice";
export interface ValueModel {
  limit?: number;
  sort?: string;
}

interface ValueAction extends ValueModel {
  type: "set_limit" | "set_sort";
}

interface LimitAndSortOptions {
  onChange?(value: ValueModel): void;
}

const valueReducer: Reducer<ValueModel, ValueAction> = (state, action) => {
  const { type, limit, sort } = action;

  switch (type) {
    case "set_limit":
      return { ...state, limit };

    case "set_sort":
      return { ...state, sort };

    default:
      return {};
  }
};

const sortOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
  { value: "wtf", label: "Error Demo" },
];

const LimitAndSort = (options: LimitAndSortOptions) => {
  const { onChange = () => {} } = options;

  const [value, dispatchValue] = useReducer(valueReducer, { sort: "asc" });

  const [limitError, setLimitError] = useState(false);
  const [sortError, setSortError] = useState(false);

  const errors = useAppSelector(selectRuleError);

  useEffect(() => {
    if (typeof onChange === "function") onChange(value);

    if (errors.findIndex((item) => item.message.includes("limit")) !== -1) setLimitError(true);

    if (errors.findIndex((item) => item.message.includes("sort")) !== -1) setSortError(true);
  }, [value, errors]);

  const handleSortOnChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const sort = e.target.value;

    dispatchValue({ type: "set_sort", sort });
  };

  const handleLimitOnChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const limit = Number(e.target.value);

    dispatchValue({ type: "set_limit", limit });
  };

  return (
    <>
      <TextField
        label="Sort"
        size="small"
        select
        defaultValue="asc"
        // helperText="Please select a sort strategy"
        error={sortError}
        onChange={handleSortOnChange}
        onFocus={() => setSortError(false)}
      >
        {sortOptions.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Limit"
        size="small"
        type="number"
        error={limitError}
        onChange={handleLimitOnChange}
        onFocus={() => setLimitError(false)}
      />
    </>
  );
};

export default LimitAndSort;
