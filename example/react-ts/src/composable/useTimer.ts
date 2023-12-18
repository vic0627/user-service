const useTimer = (callback: () => void, ms: number) => {
  const timer = setTimeout(() => {
    callback();
    clearTimeout(timer);
  }, ms);

  const clearTimer = () => {
    console.log("timer killed");
    clearTimeout(timer);
  };

  return clearTimer;
};

export default useTimer;
