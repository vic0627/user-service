export default class RequestError extends Error {
    name = "RequestError";

    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}
