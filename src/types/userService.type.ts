import RuleError from "src/core/validationEngine/RuleError";
import type { Payload, RuleObjectInterface } from "./ruleObject.type";
import type { HttpMethod, HttpResponse, RequestConfig } from "./xhr.type";
import RequestError from "src/core/requestHandler/RequestError";

/**
 * @inherit 為繼承屬性，往 children 及 api 向下繼承，越 deep 的配置優先權越高
 */

/** 從上一層 Service 繼承下來的配置 */
export interface InheritConfig
  extends ServiceFuncConfig,
    ServiceRequestConfig,
    Pick<ServiceConfigRoot, "baseURL">,
    Pick<RequestConfig, "url"> {}

/** 繼承與複寫後的配置 */
export interface OverwriteConfig extends InheritConfig, ServiceConfigChild {}

/** Final API 被調用時可配置的設定 */
export interface FinalApiConfig extends Omit<RequestConfig, "url" | "payload" | "method">, ServiceFuncConfig {}

/**
 * 參數聲明
 * - `string[]` - 僅定義需要的參數名稱
 * - `Record<string, string>` - 需要的參數名稱及其說明
 */
export type ParamDef = string[] | Record<string, string>;

/** 參數聲明(組) */
export interface ParamDefGroup {
  /** 路徑參數 */
  param?: ParamDef;
  /** 查詢參數 */
  query?: ParamDef;
  /** 主體參數 */
  body?: ParamDef;
}

/** 參數驗證階段攔截器 */
export interface ValidationHooks {
  onBeforeValidation?: (payload: Payload) => void;
  onValidationFailed?: (error?: RuleError) => void;
}

/** 請求期間回呼函式 */
export type OnRequestCallback = () => void;

/** 異步階段攔截器 */
export interface PromiseStageHooks {
  /** 異步請求時 */
  onRequest?: OnRequestCallback;
  /** 異步請求失敗 */
  onRequestFailed?: (error?: RequestError) => void;
  /** 異步請求成功 */
  onRequestSucceed?: (res: HttpResponse | void) => any;
}

/** Request 相關攔截器 */
export interface RequestHooks extends PromiseStageHooks {
  /** 建構完整 URL 前 */
  onBeforeBuildingURL?: (payload: Payload, paramDef: ParamDefGroup) => void;
  /** 發送請求前 */
  onBeforeRequest?: (payload: Payload, paramDef: ParamDefGroup) => void;
}

/** fianl api 所有攔截器 */
export interface ServiceInterceptor extends ValidationHooks, RequestHooks {}

/** @inherit 抽象層功能 */
export interface ServiceFuncConfig {
  /**
   * 啟用 runtime 參數驗證
   * @default false
   */
  validation?: boolean;
  /**
   * 啟用快取管理
   * @default false
   */
  cache?: boolean;
  /** 快取暫存時限 */
  cacheLifetime?: number;
  /** 攔截器 */
  interceptor?: ServiceInterceptor;
}

/** @inherit 請求配置 */
export interface ServiceRequestConfig {
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
export interface ServiceApiConfig extends ParamDefGroup, ServiceFuncConfig, ServiceRequestConfig {
  /** final API 名稱 */
  name: string;
  /** API 概述 */
  description?: string;
  /** 參數驗證規則 */
  rules?: RuleObjectInterface;
}

/** 服務根節點配置 */
export interface ServiceConfigRoot extends ServiceFuncConfig, Omit<ServiceRequestConfig, "method"> {
  /** 基本 URL */
  baseURL: string;
  /** 服務名稱 */
  name: string;
  /** 服務概述 */
  description?: string;
  /** API 封裝配置 */
  api?: ServiceApiConfig | ServiceApiConfig[];
  /** 子路由配置 */
  children?: ServiceConfigChild[];
}

/** 服務子節點配置 */
export interface ServiceConfigChild extends Omit<ServiceConfigRoot, "baseURL" | "name"> {
  /** 路由 */
  route: string;
  /** final API 路由名稱 */
  name?: string;
}
