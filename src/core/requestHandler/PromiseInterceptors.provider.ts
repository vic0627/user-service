import RequestObserver from "src/abstract/RequestObserver.abstract";
import { HttpResponse } from "src/types/xhr.type";

export default class PromiseInterceptors implements RequestObserver {
    subscribe(
        requestToken: symbol,
        request: () => Promise<HttpResponse>,
        ...args: any[]
    ): () => Promise<HttpResponse> {
        /**
         * @todo Promise 階段的攔截器
         */
        return request;
    }
}
