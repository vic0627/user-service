import RuleError from "src/core/validationEngine/RuleError";
import type { Payload, RuleObjectInterface } from "./ruleObject.type";
import type { RequestConfig } from "./xhr.type";

export type ParameterDeclaration = string[] | Record<string, string>;

export interface ServiceBasic {
    name?: string;
    description?: string;
    validation?: boolean;
    cache?: boolean;
}

export interface ApiConfig
    extends ServiceBasic,
        Omit<RequestConfig, "url" | "payload"> {
    param?: ParameterDeclaration;
    query?: ParameterDeclaration;
    rules?: RuleObjectInterface;
}

export interface ServiceConfig
    extends ServiceBasic,
        Omit<RequestConfig, "url" | "payload" | "method"> {
    baseURL?: string;
    route?: string;
    api?: ApiConfig | ApiConfig[];
    children?: ServiceConfig[];
}

export interface ParentConfig
    extends Pick<ServiceBasic, "cache" | "validation">,
        Omit<RequestConfig, "url" | "payload" | "method">,
        Pick<ServiceConfig, "baseURL"> {}

export interface ValidationHooks {
    onBeforeValidation?: (payload: Payload, rules?: RuleObjectInterface) => void;
    onValidationFailed?: (error?: RuleError) => void;
}

export interface FinalApiConfig
    extends Omit<RequestConfig, "url" | "payload" | "method">,
        Pick<ServiceBasic, "cache" | "validation"> {
    interceptors?: ValidationHooks;
}
