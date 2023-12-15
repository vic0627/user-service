import { Alert, AlertTitle, Slide } from "@mui/material";
import { useEffect, useState } from "react";
import delay from "../../utils/delay";

const RuleError = ({ error, onClose }: { error: Error; onClose: () => void }) => {
  const [mount, setMount] = useState(true);

  const handleOnClose = () => {
    setMount(false);
    delay(onClose, 500);
  };

  useEffect(() => {
    delay(handleOnClose, 3000);
  }, []);

  return (
    <>
      <Slide in={mount}>
        <Alert
          severity="error"
          onClose={() => handleOnClose()}
          style={{
            pointerEvents: "visible",
          }}
        >
          <AlertTitle>{error.name}</AlertTitle>
          {error.message}
        </Alert>
      </Slide>
    </>
  );
};

export default RuleError;
