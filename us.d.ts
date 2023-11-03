type ArgumentsObject = Record<string, string> | string[]

type RulesArray = string[]

type Validator<T = any> = (value: T) => void

type Rule<T = any> = string | RegExp | Validator<T>

interface RulesObject<T = any> {
    [variableName: string]: Rule<T> | Rule<T>[] | string[];
}

type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH';

type ResponseType =
  | ''
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text';

interface RequestSettings {
    headers?: Record<string, string>;
    mimeType?: string;
    responseType?: ResponseType;
    timeout?: number;
    validation?: boolean; // determine using validator on current api or not
}

interface RequestHooks<T = any> {
    onBeforeValidate?: (rules: RulesObject | RulesArray, payload: Record<string, T>) => void;
    onBeforeRequest?: (payload: Record<string, T>) => FormData | Record<string, T> | string | undefined;
    onSuccess?: (respones: T) => T;
    onError?: (error: Error) => void;

}

interface Api<T = any> extends RequestSettings, RequestHooks<T> {
    // controller name
    name: string;

    // request method
    method?: HttpRequestMethod;

    description?: string;

    // determine the properties that are needed for the parameter
    query?: ArgumentsObject;
    param?: ArgumentsObject;
    body?: ArgumentsObject;

    // validation
    rules?: RulesObject<T> | RulesArray;

    // overriding settings
    overrideHeader?: boolean; // set to true to override requestHeader
}

interface RootServiceConfig extends RequestHooks {
    baseURL: string;
    namespace: string;
    children?: ServiceConfig[];
    description?: string;
}

interface ServiceConfig extends RequestSettings, Partial<RootServiceConfig> {
    route: string;
    api: Api | Api[];
}

interface US {
    createService: (serviceConfig: ServiceConfig | RootServiceConfig) => Service;
    useService: (services: Service | Service[]) => UserService;
}

interface RO {
    partial: (target: RulesObject) => RulesObject; // set all properties optional
    required: (target: RulesObject) => RulesObject; // set all properties required

    pick: (target: RulesObject, props: RulesArray) => RulesObject; // pick some properties from target obj
    omit: (target: RulesObject, props: RulesArray) => RulesObject; // omit some properties from target obj

    extract: (...rulesObjects: RulesObject[]) => RulesObject; // intersection of objects
    merge: (...rulesObjects: RulesObject[]) => RulesObject; // union of objects
}
type ROTypes = 
  | 'string'
  | 'number'
  | 'int'
  | 'blob'
  | 'file'
  | 'filelist'
  | 'any'
  | 'null'
  | 'boolean'
  | 'object'
  | 'date'