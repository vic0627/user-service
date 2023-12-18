export default (callback: () => void = () => {}, ms: number = 10) => {
  const premise = new Promise((resolve) => {
    const t = setTimeout(() => {
      callback();
      clearTimeout(t);
      resolve(t);
    }, ms);
  });

  return premise;
};
