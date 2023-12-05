const $ = (e) => document.querySelector(e);

const $id = (e) => document.getElementById(e);

const $all = (e) => document.querySelectorAll(e);

const $delay = (callback, ms) =>
  new Promise((resolve, reject) => {
    const i = setTimeout(() => {
      clearTimeout(i);
      callback(resolve, reject);
      resolve();
    }, ms);
  });
