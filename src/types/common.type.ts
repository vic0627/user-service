export type NumOrString = number | string;

export type SelectRequired<T, P extends keyof T> = Required<Pick<T, P>>;
