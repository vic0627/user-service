import type { RuleObjectInterface } from "./ruleObject.type";
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
