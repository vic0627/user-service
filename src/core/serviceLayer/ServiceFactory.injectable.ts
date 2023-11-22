import Injectable from "src/decorator/Injectable.decorator";
import Service from "./Service";
import type { ApiConfig, ServiceConfig } from "src/types/userService.type";
import { RequestConfig } from "src/types/xhr.type";
import APIFactory from "./APIFactory.injectable";

@Injectable()
export default class ServiceFactory {
    #root = true;

    constructor(private readonly apiFactory: APIFactory) {}

    createService(serviceConfig: ServiceConfig) {
        const {
            baseURL,
            // name,
            // description,
            route,
            api,
            validation,
            cache,
            headerMap,
            headers,
            auth,
            timeout,
            timeoutErrorMessage,
            responseType,
            children,
        } = serviceConfig;

        const requestConfig = {
            auth,
            headers,
            timeout,
            timeoutErrorMessage,
            responseType,
            headerMap,
        };

        this.#routeGuard(baseURL, route);

        const service = new Service();

        this.#rootAPI(service, requestConfig, api);

        return service;
    }

    #routeGuard(baseURL?: string, route?: string) {
        if (this.#root) {
            if (!baseURL || typeof baseURL !== "string")
                throw new Error("BaseURL is required in root service");
        } else {
            if (!route || typeof route !== "string")
                throw new Error("BaseURL is required in children service");

            this.#root = false;
        }
    }

    #rootAPI(
        service: Service,
        defaultConfig: RequestConfig,
        api?: ApiConfig | ApiConfig[]
    ) {
        if (!this.#root) return;

        if (Array.isArray(api)) {
            api.forEach((config) => {});
        } else if (typeof api === "object") {
            const value = this.apiFactory.createAPI(api, defaultConfig);

            if (!api.name)
                throw new Error(
                    "Name is required when api stands alone in root service"
                );

            Object.defineProperty(service, api.name, { value });
        }
    }
}
