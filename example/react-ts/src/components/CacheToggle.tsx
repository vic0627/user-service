import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";

export interface CacheToggleOptions {
  onCacheChange?(cache: boolean): void;
}

const CacheToggle = ({ onCacheChange }: CacheToggleOptions) => {
  const [cache, setCache] = useState(true);

  useEffect(() => {
    if (typeof onCacheChange === "function") onCacheChange(cache);
  }, [cache]);

  const handleChange = () => {
    setCache((cache) => !cache);
  };

  return (
    <FormControlLabel
      control={<Switch color="success" defaultChecked />}
      label="Cache"
      onChange={handleChange}
      labelPlacement="start"
      sx={{mt: 1}}
    />
  );
};

export default CacheToggle;
