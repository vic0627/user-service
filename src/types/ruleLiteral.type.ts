import type { ByteString } from "./byte.type";
import { ClassSignature } from "./common.type";
import { RuleErrorOption } from "./ruleError.type";

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

export type TypeValidator = (value: unknown) => boolean;

export interface TypeMetadata {
    _type: BasicType;
    countable: boolean;
    measureUnit:
        | string
        | "length"
        | "size"
        | null
        | keyof Record<string, unknown>;
    allowBytes: boolean;
    proto: unknown;
    test: TypeValidator;
}

export type TypeDef = [
    _type: BasicType,
    countable: boolean,
    measureUnit: "length" | "size" | null,
    allowBytes: boolean,
    proto: ClassSignature | null,
    test: TypeValidator
];

export interface Limitation {
    max?: number;
    min?: number;
    equal?: number;
}

export interface Rule {
    type: BasicType | string;
    typeInfo?: TypeMetadata;
    limitation?: boolean;
    hasArray?: boolean;
    typeLimitation?: Limitation;
    arrayLimitation?: Limitation;
}

export type RuleValidator = (param: string, value: unknown) => RuleErrorOption;
