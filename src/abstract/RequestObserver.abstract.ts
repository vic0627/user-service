import { HttpResponse } from "src/types/xhr.type";

export default abstract class RequestObserver {
    abstract subscribe(
        requestToken: symbol,
        request: () => Promise<HttpResponse>,
        ...args: any[]
    ): () => Promise<HttpResponse>;
}
