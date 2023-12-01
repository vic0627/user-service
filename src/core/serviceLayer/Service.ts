import { InheritConfig } from "src/types/userService.type";
import { notNull } from "src/utils/common";

export default class Service {
  _name?: string;

  _parent?: Service;
  // _chirdren?: Service[];

  _config?: InheritConfig;

  constructor() {}

  mount(globalTarget: any) {
    if (typeof globalTarget !== "object" || globalTarget === null) {
      console.warn("Object required");

      return;
    }

    if (this._parent) {
      console.warn("Forbidden mount");

      return;
    }

    const name = !notNull(this._name) ? "$serviceAPI" : this._name?.startsWith("$") ? this._name : "$" + this._name;

    Object.defineProperty(globalTarget, name, {
      value: this,
    });
  }
}
