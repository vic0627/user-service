import type { ByteString } from "./byte.type";

export type CountableWithByte = "blob" | "file";

export type CountableType =
    | "string"
    | "number"
    | "int"
    | "filelist"
    | CountableWithByte;

export type UncountableType = "any" | "null" | "boolean" | "object" | "date";

export type TypeLimitationLiteral<
    C extends CountableType = CountableType,
    N extends ByteString<number> | number = number
> = `${C}@${N}` | `${C}@${N}:` | `${C}@${N}:${N}` | `${C}@:${N}`;

export type LimitationType =
    | CountableType
    | TypeLimitationLiteral
    | TypeLimitationLiteral<CountableWithByte, ByteString<number> | number>;

export type BasicRuleType = LimitationType | UncountableType;

export type ArrayLiteral<
    T extends BasicRuleType = BasicRuleType,
    N extends number = number
> = `${T}[]` | `${T}[${N}]` | `${T}[${N}:]` | `${T}[:${N}]` | `${T}[${N}:${N}]`;

export type RuleLiteral = ArrayLiteral | BasicRuleType;

export type OptionalProp = `$${string}`;

export type PropKey = OptionalProp | string;