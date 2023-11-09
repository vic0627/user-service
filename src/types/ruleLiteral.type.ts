import type { ByteString } from "./byte.type";
import { ClassSignature } from "./common.type";

export type CountableWithByte = "blob" | "file";

export type CountableType =
    | "string"
    | "number"
    | "int"
    | "filelist"
    | CountableWithByte;

export type UncountableType = "any" | "null" | "boolean" | "object" | "date";

export type BasicType = CountableType | UncountableType;

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

/**
 * ## RuleLiteral
 *
 * - `<T>` - Basic syntax
 *
 * ### Countable types only
 *
 * - `<T>@<E>` - with equal limit
 * - `<T>@<MIN>:` - with min limit
 * - `<T>@<MIN>:<MAX>` - with min, max limit
 * - `<T>@:<MAX>` - with max limit
 *
 * ### ArrayLiteral
 *
 * Assuming all types above can be considered as `<R>`.
 *
 * - `<R>[]` -
 * - `<R>[<E>]` -
 * - `<R>[<MIN>:]` -
 * - `<R>[<MIN>:<MAX>]` -
 * - `<R>[:<MAX>]` -
 */
export type RuleLiteral = ArrayLiteral | BasicRuleType | string;

export type OptionalProp = `$${string}`;

export type PropKey = OptionalProp | string;

export interface TypeMetadata {
    countable: boolean;
    measureUnit: string | "length" | "size" | null;
    allowBytes: boolean;
    proto: unknown;
    test: (value: unknown) => boolean;
}

export type TypeDef = [
    BasicType,
    boolean,
    "length" | "size" | null,
    boolean,
    ClassSignature | null,
    (value: unknown) => boolean
][];
