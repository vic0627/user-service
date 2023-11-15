export const notNull = (value: unknown): boolean =>
    value !== null && value !== undefined;

export const symbolToken = <T extends string>(target: T) => Symbol.for(target);