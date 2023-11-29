import { HttpResponse, RequestExecutor } from "src/types/xhr.type";

export default abstract class RequestObserver {
  abstract subscribe(requestToken: symbol, request: RequestExecutor, ...args: any[]): RequestExecutor;
}
