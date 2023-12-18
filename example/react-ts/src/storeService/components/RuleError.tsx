import { Alert, AlertTitle, Collapse, Slide } from "@mui/material";
import { Reducer, useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TransitionGroup } from "react-transition-group";
import useTimer from "../../composable/useTimer";
import styled from "styled-components";

const ErrorPortal = styled(TransitionGroup)`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column-reverse;
  padding-top: 20px;
  gap: 20px;
`;

const StyledAlert = styled(Alert)`
  pointer-events: visible;
`;

const RuleError = ({ errors, popError }: { errors: Error[]; popError: (index: number) => void }) => {
  const [timerKillers, setTimerKillers] = useState<(() => void)[]>([]);
  const [effectLock, setEffectLock] = useState(false);

  const clearAllTimers = () => {
    timerKillers.forEach((killer) => killer());
  };

  const deleteTimer = (i: number) => {
    timerKillers[i]();
    setTimerKillers((killers) => killers.filter((_, _i) => _i !== i));
  };

  useEffect(() => {
    if (effectLock) return;

    clearAllTimers();

    const setTime = (t: number) => 3000 + (500 / errors.length) * t;

    const timers = errors.map((_, i) =>
      useTimer(() => {
        popError(i);
      }, setTime(i)),
    );

    setTimerKillers(timers);
  }, [errors]);

  return createPortal(
    <ErrorPortal>
      {errors.map((error, i) => (
        <Collapse key={error.name + i}>
          <StyledAlert
            severity="error"
            onClose={() => {
              deleteTimer(i);
              popError(i);
            }}
          >
            <AlertTitle>{error.name}</AlertTitle>
            {error.message}
          </StyledAlert>
        </Collapse>
      ))}
    </ErrorPortal>,
    document.body,
  );
};

export default RuleError;
