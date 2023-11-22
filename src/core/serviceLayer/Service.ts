export default class Service {
    _baseURL?: string;
    _name?: string;

    _parent?: Service;
    _chirdren?: Service[];

    constructor() {}

    mount(globalTarget: any) {
        if (typeof globalTarget !== "object") {
            console.warn("Object required");
            return;
        }

        if (this._parent) {
            console.warn("Forbidden mount");
            return;
        }

        Object.defineProperty(globalTarget, this._name ?? "serviceAPI", {
            value: this,
            enumerable: true,
        });
    }
}
