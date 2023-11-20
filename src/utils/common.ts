export const notNull = (value: unknown): boolean =>
    value !== null && value !== undefined;

export const symbolToken = <T extends string>(target: T) => Symbol.for(target);

export const deepCloneFunction = (fn: Function) =>
    new Function("return " + fn.toString())() as Function;

export const pureLowerCase = <T extends string>(str: T) => /^[a-z]+$/.test(str);
