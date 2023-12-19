export default (callback: () => void = () => {}, ms: number = 10) => {
  const promise = new Promise((resolve) => {
    const t = setTimeout(() => {
      callback();
      clearTimeout(t);
      resolve(t);
    }, ms);
  });

  return promise;
};
