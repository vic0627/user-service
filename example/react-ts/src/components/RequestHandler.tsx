import { Button, ButtonGroup } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

const StyledButtonGroup = styled(ButtonGroup)``;

export interface RequestHandlerOptions {
  onSend?(endReq: () => void): void | Promise<void>;
  onAbort?(): void;
}

const RequestHandler = (options: RequestHandlerOptions) => {
  const { onSend, onAbort = () => {} } = options;

  const [reqProgress, setReqProgress] = useState(false);

  const handleSend = () => {
    if (typeof onSend !== "function") return;

    setReqProgress(true);
    onSend(() => setReqProgress(false));
  };

  const handleAbort = () => {
    if (!reqProgress) return;

    onAbort();
    setReqProgress(false);
  };

  return (
    <StyledButtonGroup size="medium" orientation="vertical" fullWidth sx={{mt: 2}}>
      <LoadingButton
        color="primary"
        variant="contained"
        loading={reqProgress}
        loadingPosition="end"
        endIcon={<SendIcon />}
        onClick={handleSend}
      >
        Send Request
      </LoadingButton>
      <Button color="error" onClick={handleAbort} variant="contained">
        Abort
      </Button>
    </StyledButtonGroup>
  );
};

export default RequestHandler;
