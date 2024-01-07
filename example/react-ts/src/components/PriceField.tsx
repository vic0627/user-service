import { FormControl, Input, InputAdornment, InputLabel } from "@mui/material";
import { ChangeEventHandler, useEffect, useId, useState } from "react";
import { useAlertSelector } from "src/store/hooks";

interface PriceFieldOption {
  onChange?(price: number): void;
}

const PriceField = ({ onChange }: PriceFieldOption) => {
  const inputId = useId();

  const [priceString, setPriceString] = useState("0");
  const [showPrice, setShowPrice] = useState(priceString);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const alert = useAlertSelector();

  const inputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    let value = e.target.value;
    const numValue = Number(value);
    const validString = /^(?!\\.)(\d+\.?\d*|\.\d+)$/.test(value) && !isNaN(numValue);

    if (!validString) {
      for (let i = 0; i < value.length; i++) {
        const char = value[i];
        const invalidChar = char !== "." && isNaN(Number(char));

        if (invalidChar) {
          setPriceString(value.replace(char, ""));

          break;
        }
      }

      return;
    }

    while (value.startsWith("0")) {
      if (value[1] === "." || value[1] === undefined) break;

      value = value.slice(1, -1);
    }

    setPriceString(value);
    if (typeof onChange === "function") onChange(numValue);
  };

  const toggleEdit = () => {
    setEdit((pre) => !pre);
  };

  const focusHandler = () => {
    toggleEdit();
    if (error) setError(false);
  };

  useEffect(() => {
    const [num, float] = priceString.split(".") as [string, undefined | string];

    const _num = num
      .split("")
      .reverse()
      .reduce((pre, cur, i) => {
        if (i && i % 3 === 0) {
          return cur + "," + pre;
        }

        return cur + pre;
      }, "");

    const _float = float?.split("").reduce((pre, cur, i) => {
      if (i && i % 3 === 0) {
        return pre + "," + cur;
      }

      return pre + cur;
    }, "");

    const result = _float ? _num + "." + _float : _num;

    setShowPrice(result);
  }, [priceString]);

  useEffect(() => {
    if (alert.findIndex((item) => item.message.includes("price"))) setError(true);
  }, [alert]);

  return (
    <FormControl fullWidth size="small" error={error} onFocus={focusHandler} onBlur={toggleEdit} onChange={inputHandler}>
      <InputLabel htmlFor={inputId}>Price</InputLabel>
      <Input
        value={edit ? priceString : showPrice}
        id={inputId}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  );
};

export default PriceField;
