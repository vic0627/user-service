import { ByteString } from "../byte.type";
import { RuleLiteral } from "../ruleLiteral.type";

export interface RoErrorConfig {
    prop?: string;
    receive?: unknown;
    rot?: RuleLiteral;
    min?: number | ByteString;
    max?: number | ByteString;
    equal?: number | ByteString;
    syntax?: string;
    type?: string;
    message?: string;
}

type TemplateConfig<K extends keyof RoErrorConfig> = Pick<RoErrorConfig, K>;

export interface RoErrorTemplate<T extends string = string> {
    type: (config: TemplateConfig<"prop" | "rot" | "receive">) => T;
    range: (config: TemplateConfig<"prop" | "min" | "max" | "receive">) => T;
    equal: (config: TemplateConfig<"prop" | "equal" | "receive">) => T;
    greater: (config: TemplateConfig<"prop" | "min" | "receive">) => T;
    less: (config: TemplateConfig<"prop" | "max" | "receive">) => T;
}

export interface RoErrorTemplateWithoutProp<T extends string = string> {
    type: (config: TemplateConfig<"rot" | "receive">) => T;
    range: (config: TemplateConfig<"min" | "max" | "receive">) => T;
    equal: (config: TemplateConfig<"equal" | "receive">) => T;
    greater: (config: TemplateConfig<"min" | "receive">) => T;
    less: (config: TemplateConfig<"max" | "receive">) => T;
}

export type RoErrorType = keyof RoErrorTemplate | "error";
