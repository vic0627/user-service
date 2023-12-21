import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useStoreService } from "@store-service";
import { HttpResponse } from "@user-service/xhr.type";
import { useCallback, useEffect, useId, useState } from "react";
import { useAlertSelector } from "src/store/hooks";

export interface CategorySelectorOptions {
  onChange?(catrgory: string): void;
}

const CategorySelector = ({ onChange }: CategorySelectorOptions) => {
  const id = useId();
  const alert = useAlertSelector();
  const storeService = useStoreService();
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const getCategories = useCallback(async () => {
    try {
      const [promise] = storeService.products.getCategories();

      const res = await promise;

      if ((res as HttpResponse).status !== 200) throw new Error("failed to get categories");

      const data = (res as HttpResponse).data as string[];

      data.push("error option");

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }, [storeService.products]);

  const handleOnChange = useCallback((e: SelectChangeEvent) => {
    const { value } = e.target;
    setSelected(value);
    if (typeof onChange === "function") onChange(value);
  }, [onChange]);

  const handleResetError = () => {
    if (error) setError(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (alert.findIndex((item) => item.message.includes("category"))) setError(true);
  }, [alert]);

  return (
    <>
      {/* @todo use <TextField /> instead */}
      <FormControl size="small" fullWidth>
        <InputLabel id={id}>Category</InputLabel>
        <Select labelId={id} label="Category" value={selected} onChange={handleOnChange} onFocus={handleResetError}>
          {categories.length &&
            categories.map((cate) => (
              <MenuItem key={cate} value={cate}>
                {cate}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};

export default CategorySelector;
