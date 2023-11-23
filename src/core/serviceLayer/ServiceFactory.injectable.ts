import Injectable from "src/decorator/Injectable.decorator";
import Service from "./Service";
import type {
    ApiConfig,
    ServiceConfig,
    ParentConfig,
} from "src/types/userService.type";
import { RequestConfig } from "src/types/xhr.type";
import APIFactory from "./APIFactory.injectable";
import { deepClone, notNull, resolveURL } from "src/utils/common";

@Injectable()
export default class ServiceFactory {
    #root = true;

    constructor(private readonly apiFactory: APIFactory) {}

    createService(serviceConfig: ServiceConfig) {
        return this.#buildServiceTree({ serviceConfig });
    }

    #buildServiceTree(config: {
        serviceConfig: ServiceConfig;
        parent?: Service;
        parentConfig?: ParentConfig;
    }) {
        const { serviceConfig, parent, parentConfig = {} } = config;

        this.#routeGuard(serviceConfig.baseURL, serviceConfig.route);

        const parentConfigCopy = deepClone(parentConfig);

        const _serviceConfig = Object.assign(parentConfigCopy, serviceConfig);
        const {
            name,
            // description,
            api,
            children,
            route,
        } = _serviceConfig;

        const { nodeConfig, reqConfig } =
            this.#destructureConfig(_serviceConfig);

        const service = new Service();

        service._parent = parent;
        if (this.#root) service._name = name;
        else service._name = name ?? route?.split("/")[0];
        // service._config = _serviceConfig;

        this.#buildAPI(service, reqConfig, api);

        // if (service._name === "products") console.log(api);

        this.#buildChildren(service, children, nodeConfig);

        return service;
    }

    #destructureConfig(serviceConfig: ServiceConfig) {
        const {
            baseURL,
            route,
            validation,
            cache,
            headerMap,
            headers,
            auth,
            timeout,
            timeoutErrorMessage,
            responseType,
        } = serviceConfig;

        let _baseURL: string;
        if (baseURL && route) _baseURL = resolveURL([baseURL, route]);
        else _baseURL = baseURL as string;

        const basicConfig = {
            validation,
            cache,
            auth,
            headers,
            timeout,
            timeoutErrorMessage,
            responseType,
            headerMap,
        };

        const nodeConfig = Object.assign(
            { baseURL: _baseURL },
            basicConfig
        ) as ParentConfig;

        const reqConfig = Object.assign(
            { url: _baseURL },
            basicConfig
        ) as RequestConfig;

        return { nodeConfig, reqConfig };
    }

    #routeGuard(baseURL?: string, route?: string) {
        if (this.#root) {
            if (!baseURL || typeof baseURL !== "string")
                throw new Error("BaseURL is required in root service");
            this.#root = false;
        } else {
            if (!route || typeof route !== "string")
                throw new Error("Route is required in children service");
            if (baseURL)
                throw new Error("BaseURL is only configurable in root service");
        }
    }

    #buildAPI(
        service: Service,
        defaultConfig: RequestConfig,
        api?: ApiConfig | ApiConfig[]
    ) {
        if (Array.isArray(api)) {
            api.forEach((config) => {
                const value = this.apiFactory.createAPI(config, defaultConfig);

                if (!config.name) throw new Error("Name is required");

                Object.defineProperty(service, config.name, { value });
            });
        } else if (typeof api === "object") {
            const value = this.apiFactory.createAPI(api, defaultConfig);

            if (!api.name) throw new Error("Name is required");

            Object.defineProperty(service, api.name, { value });
        }
    }

    #buildChildren(
        service: Service,
        children?: ServiceConfig[],
        parentConfig?: ParentConfig
    ) {
        if (!notNull(children)) return;

        const isArray = Array.isArray(children);
        if (!isArray) throw new Error("Children must be an array");

        const singleMethod = (children: ServiceConfig) =>
            !children?.children && !Array.isArray(children?.api);

        children.forEach((child) => {
            if (singleMethod(child)) {
                const { name, value } = this.#buildSingleMethod(
                    child,
                    parentConfig as ParentConfig
                );

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

    #buildSingleMethod(child: ServiceConfig, parentConfig: ParentConfig) {
        const { route, api } = child;
        const { baseURL } = parentConfig;

        const url = resolveURL([baseURL as string, route as string]);

        const configCopy = deepClone(parentConfig) as RequestConfig &
            ParentConfig &
            ServiceConfig;

        Object.assign(configCopy, child);

        delete configCopy.baseURL;
        delete configCopy.route;
        delete configCopy.api;
        delete configCopy.children;

        configCopy.url = url;

        const name =
            (api as ApiConfig)?.name ?? child.name ?? route?.split("/")[0];
        if (!name)
            throw new Error(
                "Name or route must required when defining single method"
            );

        const value = this.apiFactory.createAPI(api as ApiConfig, configCopy);

        return { name, value };
    }
}
