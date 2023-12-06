import { InheritConfig } from "src/types/userService.type";
import { notNull } from "src/utils/common";

/**
 * 抽象層節點
 * @description 子路由節點、節點上的 Final API，都會掛載在它實例上
 */
export default class Service {
  /**
   * 節點名稱
   * @description 根節點一定要有 `name`，子節點有 `name` 就用 `name`，
   * 沒 `name` 先找 `route`，但 `route` 若有多層路徑，只取第一層路徑來用。
   */
  _name?: string;

  /** 父節點 */
  _parent?: Service;
  // _chirdren?: Service[];

  /** 該層通用配置 */
  _config?: InheritConfig;

  constructor() {}

  /**
   * 將服務抽象層節點掛載至物件
   */
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
