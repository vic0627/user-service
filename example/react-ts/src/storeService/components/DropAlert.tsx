import { Alert, AlertTitle, Collapse, List, ListItem } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { TransitionGroup } from "react-transition-group";
import useTimer from "src/composable/useTimer";
import styled from "styled-components";
import { useAlertSelector, useAppDispatch } from "src/store/hooks";
import { del } from "src/store/slice/alertSlice";

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

const initNum = 1000;

const DropAlert = () => {
  const [timerKillers, setTimerKillers] = useState<(() => void)[]>([]);
  const [fadeTime, setFadeTime] = useState(initNum);
  const previousLength = useRef(0);

  const dispatch = useAppDispatch();
  const alert = useAlertSelector();

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

  const easing = useCallback((t: number) => {
    if (t === initNum) return t * 0.999;
    else return t * (t / initNum);
  }, []);

  useEffect(() => {
    /** @todo 優化 - 離開的速度 */
    if (!fadeTime) return;

    clearAllTimers();

    const setTime = (t: number) => fadeTime + (100 / alert.length) * t;

    const timers = alert.map((_, i) =>
      useTimer(
        () => {
          handleOnClose(i);
        },
        setTime(i),
      ),
    );

    setTimerKillers(timers);
  }, [fadeTime]);

  useEffect(() => {
    const currentLength = alert.length;

    if (previousLength.current > currentLength) {
      setFadeTime((pre) => pre * 0.8);
    } else if (currentLength > previousLength.current) {
      setFadeTime(initNum);
    } else if (currentLength === previousLength.current) {
      if (currentLength === 0) {
        setFadeTime(0);
      } else {
        setFadeTime(initNum);
      }
    }

    previousLength.current = currentLength;
  }, [alert]);

  return createPortal(
    <StyledList
      sx={{
        position: "fixed",
        pt: "10px",
      }}
    >
      <TransitionGroup>
        {alert.map((item, i) => (
          <Collapse key={item._id}>
            <ListItem>
              <StyledAlert
                severity={item.type || "error"}
                variant={item.variant || "standard"}
                onClose={() => handleOnClose(i)}
              >
                <AlertTitle>{item.title}</AlertTitle>
                {item.message}
              </StyledAlert>
            </ListItem>
          </Collapse>
        ))}
      </TransitionGroup>
    </StyledList>,
    document.body,
  );
};

export default DropAlert;
