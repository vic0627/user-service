import { Box, Typography, useTheme } from "@mui/material";
import RequestHandler, { RequestHandlerOptions } from "./RequestHandler";
import styled from "styled-components";
import { ReactNode } from "react";
import CacheToggle, { CacheToggleOptions } from "./CacheToggle";

interface RequestFormOptions extends RequestHandlerOptions, CacheToggleOptions {
  /** form nodes */
  children: ReactNode;
  title: string;
}

const StyledRequestForm = styled(Box)`
  width: 300px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.shape.borderRadius}px;

  & > .MuiTextField-root {
    margin: 1rem 0 0;
  }
`;

const RequestForm = ({ title, children, onSend, onAbort, onCacheChange }: RequestFormOptions) => {
  const theme = useTheme();

  return (
    <StyledRequestForm theme={theme}>
      <Typography variant="h4">{title}</Typography>
      {children}
      {!!onCacheChange && <CacheToggle onCacheChange={onCacheChange} />}
      <RequestHandler onSend={onSend} onAbort={onAbort} />
    </StyledRequestForm>
  );
};

export default RequestForm;
