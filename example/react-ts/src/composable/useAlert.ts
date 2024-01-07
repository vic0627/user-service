import { useCallback, useEffect, useId, useState } from "react";
import { useAlertSelector } from "src/store/hooks";

type StateStore = Record<string, boolean>;

interface UseAlertOptions<T> {
  keyword: T;
}

type StateSet = [state: boolean, controller: () => void]

type UseAlertResult<T> = T extends string ? StateSet : T extends string[] ? StateSet[] : never;

const useAlert = <T extends string | string[]>({ keyword }: UseAlertOptions<T>): UseAlertResult<T> => {
  const alert = useAlertSelector();
  const getId = useCallback((keyword: string) => keyword + "@" + useId(), []);
  const id = typeof keyword === "string" ? getId(keyword) : keyword.map((k) => getId(k));
  const initialState: StateStore = {};

  const idIfElse = (callback: (value: string) => void) => {
    if (Array.isArray(id)) id.forEach(callback);
    else callback(id);
  };

  idIfElse((val) => {
    initialState[val] = false;
  });

  const [state, setState] = useState<StateStore>({});

  const setErrorTrue = useCallback(
    (id: string) => {
      const keyword = id.split("@")[0];
      if (alert.findIndex((item) => item.message.includes(keyword)) !== -1) setState((pre) => ({ ...pre, [id]: true }));
    },
    [alert],
  );

  useEffect(() => {
    idIfElse(setErrorTrue);
  }, [alert]);

  if (Array.isArray(id))
    return id.map((i) => [state[i], () => setState((pre) => ({ ...pre, [i]: false }))]) as UseAlertResult<T>;
  else return [state[id], () => setState((pre) => ({ ...pre, [id]: false }))] as UseAlertResult<T>;
};

export default useAlert;
