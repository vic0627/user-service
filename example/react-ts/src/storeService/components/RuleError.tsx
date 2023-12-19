import { Alert, AlertTitle, Collapse, List, ListItem } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { TransitionGroup } from "react-transition-group";
import useTimer from "../../composable/useTimer";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { del } from "../../store/slice/ruleErrorSlice";

const StyledList = styled(List)`
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  justify-content: center;
`;

const StyledAlert = styled(Alert)`
  pointer-events: visible;
`;

const RuleError = () => {
  const [timerKillers, setTimerKillers] = useState<(() => void)[]>([]);

  const dispatch = useAppDispatch();
  const errors = useAppSelector((state) => state.ruleErrorSlice.errors);

  const popError = useCallback((i: number) => {
    dispatch(del(i));
  }, []);

  const clearAllTimers = useCallback(() => {
    timerKillers.forEach((killer) => killer());
    setTimerKillers([]);
  }, [timerKillers]);

  const deleteTimer = useCallback(
    (i: number) => {
      const timeKiller = timerKillers[i];
      if (typeof timeKiller === "function") timeKiller();
      setTimerKillers((killers) => killers.filter((_, _i) => _i !== i));
    },
    [timerKillers],
  );

  const handleOnClose = useCallback((i: number) => {
    deleteTimer(i);
    popError(i);
  }, []);

  useEffect(() => {
    /** @todo 優化 - 離開的速度 */
    clearAllTimers();

    const setTime = (t: number) => 1000 + (100 / errors.length) * t;

    const timers = errors.map((_, i) =>
      useTimer(() => {
        handleOnClose(i);
      }, setTime(i)),
    );

    setTimerKillers(timers);
  }, [errors]);

  return createPortal(
    <StyledList
      sx={{
        position: "fixed",
        pt: "10px",
      }}
    >
      <TransitionGroup>
        {errors.map((err, i) => (
          <Collapse key={err.id}>
            <ListItem>
              <StyledAlert severity="error" onClose={() => handleOnClose(i)}>
                <AlertTitle>{err.name}</AlertTitle>
                {err.message}
              </StyledAlert>
            </ListItem>
          </Collapse>
        ))}
      </TransitionGroup>
    </StyledList>,
    document.body,
  );
};

export default RuleError;
