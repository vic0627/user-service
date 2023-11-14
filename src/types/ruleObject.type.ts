import { RuleLiteral, PropKey, RuleValidator } from "./ruleLiteral.type";

export type RuleEvaluation = RuleValidator | RegExp;

export type ValidRule = string | RuleLiteral | RuleEvaluation;

export type RuleObject = Record<PropKey, ValidRule | ValidRule[]>;

export interface TypeCheckResult {
    rotCheck: boolean;
    roType: "function" | "regexp" | "rot" | null;
    reason: string | null;
    rot: unknown;
    hasLimitation?: boolean;
    hasArray?: boolean;
    type?: string;
}
