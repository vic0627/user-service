import type { RequestConfig } from "src/types/xhr.type";
import type {
  InheritConfig,
  OverwriteConfig,
  ServiceApiConfig,
  ServiceConfigChild,
  ServiceConfigRoot,
} from "src/types/userService.type";
import Injectable from "src/decorator/Injectable.decorator";
import Service from "./Service";
import APIFactory from "../requestHandler/APIFactory.injectable";
import { deepClone, notNull, resolveURL } from "src/utils/common";

@Injectable()
export default class ServiceFactory {
  #root = true;

  constructor(private readonly apiFactory: APIFactory) {}

  createService(serviceConfig: ServiceConfigRoot) {
    return this.#buildServiceTree({ serviceConfig });
  }

  #buildServiceTree(config: {
    serviceConfig: ServiceConfigRoot | ServiceConfigChild;
    parent?: Service;
    parentConfig?: InheritConfig;
  }) {
    const { serviceConfig, parent, parentConfig = {} } = config;

    this.#routeGuard((serviceConfig as ServiceConfigRoot).baseURL, (serviceConfig as ServiceConfigChild).route);

    const parentConfigCopy = deepClone(parentConfig) as InheritConfig | {};

    const overwriteConfig = Object.assign(parentConfigCopy, serviceConfig) as OverwriteConfig;

    const {
      name,
      // description,
      api,
      children,
      route,
    } = overwriteConfig;

    const { nodeConfig, reqConfig } = this.#destructureConfig(overwriteConfig);

    const service = new Service();

    service._parent = parent;

    if (this.#root) {
      service._name = name;
    } else {
      service._name = name ?? this.#getFirstRoute(route);
    }

    if (!service._name) {
      throw new Error("Name is required");
    }

    service._config = overwriteConfig;

    this.#buildAPI(service, reqConfig, api);

    this.#buildChildren(service, children, nodeConfig);

    return service;
  }

  #destructureConfig(serviceConfig: ServiceConfigRoot | ServiceConfigChild) {
    const { validation, cache, headerMap, headers, auth, timeout, timeoutErrorMessage, responseType, interceptor } =
      serviceConfig;

    let _baseURL: string;

    const baseURL = (serviceConfig as ServiceConfigRoot).baseURL;
    const route = (serviceConfig as ServiceConfigChild).route;

    if (baseURL && route) {
      _baseURL = resolveURL([baseURL, route]);
    } else {
      _baseURL = baseURL as string;
    }

    const basicConfig = {
      validation,
      cache,
      auth,
      headers,
      timeout,
      timeoutErrorMessage,
      responseType,
      headerMap,
      interceptor,
    };

    const nodeConfig = Object.assign({ baseURL: _baseURL }, basicConfig) as InheritConfig;

    const reqConfig = Object.assign({ url: _baseURL }, basicConfig) as RequestConfig;

    return { nodeConfig, reqConfig };
  }

  #routeGuard(baseURL?: string, route?: string) {
    if (this.#root) {
      if (!baseURL || typeof baseURL !== "string") {
        throw new Error("BaseURL is required in root service");
      }

      this.#root = false;
    } else {
      if (!route || typeof route !== "string") {
        throw new Error("Route is required in children service");
      }

      if (baseURL) {
        throw new Error("BaseURL is only configurable in root service");
      }
    }
  }

  #getFirstRoute(route?: string) {
    if (!route) {
      return;
    }

    return route.split("/")[0];
  }

  #buildAPI(service: Service, defaultConfig: RequestConfig, api?: ServiceApiConfig | ServiceApiConfig[]) {
    if (Array.isArray(api)) {
      api.forEach((config) => {
        const value = this.apiFactory.createAPI(config, defaultConfig);

        if (!config.name) {
          throw new Error("Name is required");
        }

        Object.defineProperty(service, config.name, { value });
      });
    } else if (typeof api === "object") {
      const value = this.apiFactory.createAPI(api, defaultConfig);

      if (!api.name) {
        throw new Error("Name is required");
      }

      Object.defineProperty(service, api.name, { value });
    }
  }

  #buildChildren(service: Service, children?: ServiceConfigChild[], parentConfig?: InheritConfig) {
    if (!notNull(children)) {
      return;
    }

    const isArray = Array.isArray(children);

    if (!isArray) {
      throw new Error("Children must be an array");
    }

    const singleMethod = (children: ServiceConfigChild) => !children?.children && !Array.isArray(children?.api);

    children.forEach((child) => {
      if (singleMethod(child)) {
        const { name, value } = this.#buildSingleMethod(child, parentConfig as InheritConfig);

        Object.defineProperty(service, name, {
          value,
        });
      } else {
        const value = this.#buildServiceTree({
          serviceConfig: child,
          parent: service,
          parentConfig,
        });

        Object.defineProperty(service, value._name as string, {
          value,
        });
      }
    });
  }

  #buildSingleMethod(child: ServiceConfigChild, parentConfig: InheritConfig) {
    const { route, api } = child;
    const { baseURL } = parentConfig;

    const url = resolveURL([baseURL as string, route as string]);

    const configCopy = deepClone(parentConfig);

    Object.assign(configCopy, child);

    // delete configCopy.baseURL;
    // delete configCopy.route;
    // delete configCopy.api;
    // delete configCopy.children;

    configCopy.url = url;

    const name = (api as ServiceApiConfig)?.name ?? child.name ?? this.#getFirstRoute(route);

    if (!name) {
      throw new Error("Name or route must required when defining single method");
    }

    const value = this.apiFactory.createAPI(api as ServiceApiConfig, configCopy);

    return { name, value };
  }
}
