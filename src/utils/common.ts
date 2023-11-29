import { StringAndStringArray } from "src/types/common.type";

export const notNull = (value: unknown): boolean => value !== null && value !== undefined;

export const symbolToken = <T extends string>(target: T) => Symbol.for(target);

export const deepCloneFunction = (fn: Function) => new Function("return " + fn.toString())() as Function;

export const pureLowerCase = <T extends string>(str: T) => /^[a-z]+$/.test(str);

export const getRanNum = (type: "string" | "number" = "number") => {
  const ran = Math.random();

  if (type === "number") {
    return ran;
  } else if (type === "string") {
    return ran.toString();
  }

  throw new Error("Get random number failed");
};

export const mergeObject = (...targets: any[]) => {
  const newObject: any = {};

  for (const o of targets) {
    for (const key in o) {
      if (!Object.prototype.hasOwnProperty.call(o, key)) {
        continue;
      }

      const value = o[key];

      Object.defineProperty(newObject, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
  }

  return newObject;
};

export const resolveURL = (url: StringAndStringArray, query?: Record<string, string | number>) => {
  const isArray = Array.isArray(url);

  let str: string;

  if (isArray) {
    if (typeof url[0] !== "string") {
      throw new TypeError("BaseURL can only be string");
    }

    str = url[0];
    url.shift();
  } else if (typeof url === "string") {
    str = url;
  } else {
    throw new TypeError("Unexpected type for url");
  }

  const iterator = [...(isArray ? url : [])];

  iterator.forEach((uri) => {
    const slashEnd = str.endsWith("/");

    if (typeof uri === "number") {
      if (!slashEnd) {
        str += "/";
      }

      str += uri;

      return;
    }

    const slashStart = uri.startsWith("/");

    if (slashEnd && slashStart) {
      str += uri.slice(1);

      return;
    }

    if (!slashEnd && !slashStart) {
      str += "/" + uri;

      return;
    }

    str += uri;
  });

  if (str.endsWith("/")) {
    str = str.slice(0, -1);
  }

  if (!query) {
    return str;
  }

  Object.entries(query).forEach(([key, value], i) => {
    if (!i) {
      str += "?";
    } else {
      str += "&";
    }

    str += key + "=" + value;
  });

  return str;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const deepClone = <T extends unknown | unknown[]>(source: T) => {
  if (typeof source !== "object" || source === null) {
    return source;
  }

  const target = Array.isArray(source) ? ([] as T) : ({} as T);

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = deepClone(source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
};
