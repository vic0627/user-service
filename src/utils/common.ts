import { StringAndStringArray } from "src/types/common.type";

export const notNull = (value: unknown): boolean =>
    value !== null && value !== undefined;

export const symbolToken = <T extends string>(target: T) => Symbol.for(target);

export const deepCloneFunction = (fn: Function) =>
    new Function("return " + fn.toString())() as Function;

export const pureLowerCase = <T extends string>(str: T) => /^[a-z]+$/.test(str);

export const getRanNum = (type: "string" | "number" = "number") => {
    const ran = Math.random();

    if (type === "number") return ran;
    else if (type === "string") return ran.toString();

    throw new Error("Get random number failed");
};

export const mergeObject = (...targets: any[]) => {
    const newObject: any = {};

    for (const o of targets) {
        for (const key in o) {
            if (!Object.prototype.hasOwnProperty.call(o, key)) continue;

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

export const resolveURL = (
    url: StringAndStringArray,
    query?: Record<string, string>
) => {
    const isArray = Array.isArray(url);

    let str = isArray ? "" : typeof url === "string" ? url : null;

    if (str === null) throw new TypeError("Unexpected type for url");

    const iterator = [...(isArray ? url : [])];

    for (const uri of iterator) {
        if (str.endsWith("/") && uri.startsWith("/")) {
            str += uri.slice(1);

            continue;
        }

        str += uri;
    }

    if (!query) return str;

    Object.entries(query).forEach(([key, value], i) => {
        if (!i) str += "?";

        str += key + "=" + value;
    });

    return str;
};
