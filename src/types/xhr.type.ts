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

export type ResponseType =
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";

export interface HttpHooks {
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
