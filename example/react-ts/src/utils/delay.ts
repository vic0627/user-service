export default (callback: () => void, ms: number = 10) => {
  const t = setTimeout(() => {
    callback();
    clearTimeout(t);
  }, ms);
};
