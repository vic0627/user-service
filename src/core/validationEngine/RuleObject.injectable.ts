import Injectable from "src/decorator/Injectable.decorator";
import StringRule from "./StringRule.injectable";
import RuleArray from "./RuleArray.injectable";
import { ObjectRules, Payload, RuleObjectInterface, ValidRule } from "src/types/ruleObject.type";
import { RuleValidator } from "src/types/ruleLiteral.type";
import RuleError from "./RuleError";
import { notNull } from "src/utils/common";
import Expose from "src/decorator/Expose.decorator";

/**
 * 參數驗證器生成工廠
 */
@Expose()
@Injectable()
export default class RuleObject {
  #optionalSymbol = "$";

  constructor(
    private readonly stringRule: StringRule,
    private readonly ruleArray: RuleArray,
  ) {}

  /**
   * 主要入口函式
   * @param rule 規則物件
   * @returns payload 驗證器
   */
  evaluate(rule?: RuleObjectInterface) {
    // 1. 判斷規則物件型別，無合法規則物件時，返回空函式
    const invalidRule = !notNull(rule) || typeof rule !== "object" || Array.isArray(rule);

    if (invalidRule) {
      return () => {};
    }

    // 2. 評估規則物件，取得所有參數驗證器與必要參數
    const { ruleLib, required } = this.#evaluateRules(rule as RuleObjectInterface);

    // 3. 返回 payload 驗證器
    return (payload: Payload) => {
      // 3-1. 驗證必要參數是否存在
      required.forEach((key) => {
        if (!(key in payload)) {
          throw new RuleError(`Parameter '${key}' is required`);
        }
      });

      // 3-2. 驗證參數是否合規
      this.#traverseObject(payload, (key, value) => {
        if (!(key in ruleLib)) {
          return;
        }

        const validator = ruleLib[key];

        validator(key, value);
      });
    };
  }

  #evaluateRules(rule: RuleObjectInterface) {
    /** 參數驗證器字典 */
    const ruleLib: Record<string, (param: string, value: unknown) => void> = {};

    /** 必要參數 */
    const required: string[] = [];

    this.#traverseObject(rule, (key, value) => {
      const optional = this.isOptionalParam(key);

      if (optional) {
        key = key.slice(1);
      } else {
        required.push(key);
      }

      let validator: RuleValidator | undefined;

      if (typeof value === "symbol") {
        validator = this.ruleArray.find(value).executor;
      } else if (Array.isArray(value)) {
        const token = this.ruleArray.defineUnion(...value);

        validator = this.ruleArray.find(token).executor;
      } else {
        validator = this.stringRule.evaluate(value as ValidRule);
      }

      Object.defineProperty(ruleLib, key, {
        value: (param: string, value: unknown) => {
          const { valid, msg } = (validator as RuleValidator)(param, value);

          if (!valid) {
            throw new RuleError(msg ?? "Undefind rule error");
          }
        },
      });
    });

    return { ruleLib, required };
  }

  isOptionalParam(param: string) {
    return param.startsWith(this.#optionalSymbol);
  }

  #wrapper(
    target: RuleObjectInterface,
    canModifyKey: (key: string) => boolean,
    modifyKeyCallback: (key: string) => string,
    canDefineProp: (key: string) => boolean,
  ) {
    const newRules: RuleObjectInterface = {};

    this.#traverseObject(target, (key, value) => {
      if (canModifyKey(key)) {
        key = modifyKeyCallback(key);
      }

      if (canDefineProp(key)) {
        Object.defineProperty(newRules, key, {
          value,
          enumerable: true,
        });
      }
    });

    return newRules;
  }

  #traverseObject(o: RuleObjectInterface | Payload, callback: (key: string, value: ObjectRules | unknown) => void) {
    if (typeof o !== "object" || o === null || Array.isArray(o)) {
      throw new TypeError("Only object literal is accepted");
    }

    for (const key in o) {
      const hasProp = Object.prototype.hasOwnProperty.call(o, key);

      if (!hasProp) {
        continue;
      }

      callback(key, o[key]);
    }
  }

  // #region 規則物件的 util function，給 client 用的
  mergeRules(...targets: RuleObjectInterface[]) {
    const newRules: RuleObjectInterface = {};

    for (const ruleObject of targets) {
      this.#traverseObject(ruleObject, (key, value) => {
        Object.defineProperty(newRules, key, {
          value,
          enumerable: true,
        });
      });
    }

    return newRules;
  }

  partialRules(target: RuleObjectInterface) {
    return this.#wrapper(
      target,
      (key) => !this.isOptionalParam(key),
      (key) => this.#optionalSymbol + key,
      () => true,
    );
  }

  requiredRules(target: RuleObjectInterface) {
    return this.#wrapper(
      target,
      (key) => this.isOptionalParam(key),
      (key) => key.slice(1),
      () => true,
    );
  }

  pickRules(target: RuleObjectInterface, ...args: (keyof RuleObjectInterface)[]) {
    return this.#wrapper(
      target,
      () => false,
      (key) => key,
      (key) => {
        if (this.isOptionalParam(key)) {
          key = key.slice(1);
        }

        return args.includes(key);
      },
    );
  }

  omitRules(target: RuleObjectInterface, ...args: (keyof RuleObjectInterface)[]) {
    return this.#wrapper(
      target,
      () => false,
      (key) => key,
      (key) => {
        if (this.isOptionalParam(key)) {
          key = key.slice(1);
        }

        return !args.includes(key);
      },
    );
  }
  // #endregion
}
