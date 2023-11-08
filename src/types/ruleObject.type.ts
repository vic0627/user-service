import {
    ROArray,
    ROIntersectionArray,
    ROUnionArray,
} from "src/core/ro/roArray";
import { RuleLiteral, PropKey } from "./ruleLiteral.type";

export interface RuleValidation {
    result: boolean;
    errorMessage?: string;
}

export type RuleValidator = (value: unknown) => RuleValidation;

export type ValidRule = string | RuleLiteral | RuleValidator | RegExp;

export type RuleObject = Record<
    PropKey,
    | ValidRule
    | ValidRule[]
    | ROArray<ValidRule>
    | ROUnionArray
    | ROIntersectionArray
>;

export interface TypeCheckResult {
    rotCheck: boolean;
    roType: "function" | "regexp" | "rot" | null;
    reason: string | null;
    rot: unknown;
    hasLimitation?: boolean;
    hasArray?: boolean;
    type?: string;
}
