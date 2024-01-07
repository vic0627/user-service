import { MenuItem, TextField } from "@mui/material";
import { ChangeEventHandler, Reducer, useEffect, useReducer } from "react";
import useAlert from "src/composable/useAlert";
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

  const [[limitError, initLimitError], [sortError, initSortError]] = useAlert({ keyword: ["limit", "sort"] });

  useEffect(() => {
    if (typeof onChange === "function") onChange(value);
  }, [value]);

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
        error={sortError}
        onChange={handleSortOnChange}
        onFocus={initSortError}
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
        onFocus={initLimitError}
      />
    </>
  );
};

export default LimitAndSort;
