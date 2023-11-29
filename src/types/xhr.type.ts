export type HttpMethod =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH";

export interface RequestHooks {
  // on;
}

export enum enumHttpMethod {
  GET = "GET",
  DELETE = "DELETE",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
}

export type MimeString =
  | "text/plain"
  | "application/javascript"
  | "application/json"
  | "text/html"
  | "application/xml"
  | "application/pdf"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "audio/mpeg"
  | "audio/wav"
  | "video/mp4"
  | "video/quicktime";

export interface HttpAuthentication {
  username: string;
  password: string;
}

export interface HeadersConfig {
  ["Content-Type"]?: MimeString | string;
  ["Authorization"]?: `Basic ${string}:${string}`;
}

export interface RequestConfig {
  auth?: HttpAuthentication;
  headers?: HeadersConfig;
  timeout?: number;
  timeoutErrorMessage?: string;
  responseType?: XMLHttpRequestResponseType;
  headerMap?: boolean;
  url?: string;
  payload?: unknown;
  method?: HttpMethod;
}

export interface PromiseExecutor {
  resolve: (value: HttpResponse) => void;
  reject: (reason?: any) => void;
  config?: RequestConfig;
}

export type RequestExecutor = (() => Promise<HttpResponse | void>) | (() => Promise<HttpResponse>);

export interface RequestDetail {
  requestToken: symbol;
  request: RequestExecutor;
  abortController: () => void;
  config: RequestConfig;
}

export interface HttpResponse {
  data: any;
  status: number;
  statusText: string;
  headers: string | Record<string, string>;
  config: RequestConfig | undefined;
  request: XMLHttpRequest;
}
