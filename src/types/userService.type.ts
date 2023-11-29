import RuleError from "src/core/validationEngine/RuleError";
import type { Payload, RuleObjectInterface } from "./ruleObject.type";
import type { HttpMethod, HttpResponse, RequestConfig } from "./xhr.type";
import RequestError from "src/core/requestHandler/RequestError";

export type ParameterDeclaration = string[] | Record<string, string>;

export interface ServiceBasic {
  name?: string;
  description?: string;
  validation?: boolean;
  cache?: boolean;
}

export interface ApiConfig extends ServiceBasic, Omit<RequestConfig, "url" | "payload"> {
  param?: ParameterDeclaration;
  query?: ParameterDeclaration;
  rules?: RuleObjectInterface;
}

export interface ServiceConfig extends ServiceBasic, Omit<RequestConfig, "url" | "payload" | "method"> {
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
  onBeforeValidation?: (payload: Payload) => void;
  onValidationFailed?: (error?: RuleError) => void;
  onValidationSucceed?: (payload: Payload) => void;
}

export interface FinalApiConfig
  extends Omit<RequestConfig, "url" | "payload" | "method">,
    Pick<ServiceBasic, "cache" | "validation"> {
  interceptors?: ValidationHooks;
}

/**
 * 下列介面、型別為最終參考
 * @inherit 為繼承屬性，往 children 及 api 向下繼承，越 deep 的配置優先權越高
 */

/**
 * - `string[]` - 僅定義需要的參數名稱
 * - `Record<string, string>` - 需要的參數名稱及其說明
 */
type ParamDef = string[] | Record<string, string>;

interface ParamDefGroup {
  /** 路徑參數 */
  param?: ParamDef;
  /** 查詢參數 */
  query?: ParamDef;
  /** 主體參數 */
  body?: ParamDef;
}

interface RequestHooks {
  onBeforeBuildingURL?: (payload: Payload, paramDef: ParamDefGroup) => void;
  onBeforeRequest?: (payload: Payload, paramDef: ParamDefGroup) => void;
  onRequest?: () => void;
  onRequestFailed?: (error?: RequestError) => void;
  onRequestSucceed?: (res: HttpResponse) => void;
}

/** @inherit 抽象層功能 */
interface ServiceFuncConfig {
  /**
   * 啟用 runtime 參數驗證
   * @default false
   */
  validation?: boolean;
  /**
   * 啟用快取管理
   * @default false
   */
  cache?: boolean; // default false
}

/** @inherit 請求配置 */
interface ServiceRequestConfig {
  /**
   * HTTP 方法
   * @default "GET"
   */
  method?: HttpMethod;
  /** 請求標頭 */
  headers?: Record<string, string>;
  /** 身分授權 */
  auth?: {
    username?: string;
    password?: string;
  };
  /** 超時(ms) */
  timeout?: number;
  /** 超時錯誤訊息 */
  timeoutErrorMessage?: string;
  /** 響應類型 */
  responseType?: XMLHttpRequestResponseType;
  /** 將響應標頭轉換為物件格式 */
  headerMap?: boolean;
}

/** API 封裝配置 */
interface ServiceApiConfig extends ParamDefGroup, ServiceFuncConfig, ServiceRequestConfig {
  name: string;
  description?: string;

  /** 參數驗證規則 */
  rules?: RuleObjectInterface;
}

/** 服務根節點配置 */
interface ServiceConfigRoot extends ServiceFuncConfig, Omit<ServiceRequestConfig, "method"> {
  baseURL: string;
  name: string;
  description?: string;
  api?: ServiceApiConfig | ServiceApiConfig[];
  children?: ServiceConfigChild | ServiceConfigChild[];
}

/** 服務子節點配置 */
interface ServiceConfigChild extends Omit<ServiceConfigRoot, "baseURL" | "name"> {
  route: string;
  name?: string;
}
