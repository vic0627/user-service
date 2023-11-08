import { ByteString } from "../byte.type";
import { RuleLiteral } from "../ruleLiteral.type";

export interface RoErrorConfig {
    /**
     * property name
     */
    prop?: string;

    /**
     * the actual value received
     */
    receive?: unknown;

    /**
     * rule literal
     */
    rot?: RuleLiteral;

    /**
     * minimal limitatin
     */
    min?: number | ByteString;

    /**
     * maximum limitation
     */
    max?: number | ByteString;

    /**
     * equal limitation
     */
    equal?: number | ByteString;

    /**
     * Error message with SyntaxError
     */
    syntax?: string;
    
    
    /**
     * Error message with TypeError
     */
    type?: string;
    
    /**
     * Error message
     */
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
