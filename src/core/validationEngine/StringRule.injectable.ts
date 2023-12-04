import Injectable from "src/decorator/Injectable.decorator";
import TypeLib from "./TypeLib.provider";
import { ByteConvertor } from "src/utils/Byte.provider";
import type { Limitation, Rule, RuleLiteral, RuleValidator, TypeMetadata } from "src/types/ruleLiteral.type";
import { RuleErrorOption } from "src/types/ruleError.type";
import { ValidRule } from "src/types/ruleObject.type";

/**
 * Check and destructure RuleLiteral
 */
@Injectable()
export default class StringRule {
  #limitSymbol = "@";
  #rangeSymbol = ":";
  #leftSquareBracket = "[";
  #rightSquareBracket = "]";

  constructor(
    private readonly typeLib: TypeLib,
    private readonly byteConvertor: ByteConvertor,
  ) {}

  /**
   * 是否為純粹的型別，不包含數量限制、陣列語法
   */
  isPureType(rot: string) {
    return this.typeLib.has(rot);
  }

  /**
   * 是否含數量限制語法
   */
  hasLimitation(rot: string) {
    const firstLimit = rot.indexOf(this.#limitSymbol);
    const lastLimit = rot.lastIndexOf(this.#limitSymbol);

    if (firstLimit !== -1 && firstLimit === lastLimit) {
      return true;
    }

    if (firstLimit === -1) {
      return false;
    }

    throw new SyntaxError(`Bad limitation syntax '${rot}'.`);
  }

  /**
   * 是否含陣列語法
   */
  hasArray(rot: string) {
    const LBracketIdx = rot.indexOf(this.#leftSquareBracket);
    const LBracketLastIdx = rot.lastIndexOf(this.#leftSquareBracket);
    const hasValidLBracket = LBracketIdx !== -1 && LBracketIdx === LBracketLastIdx;

    const RBracketIdx = rot.indexOf(this.#rightSquareBracket);
    const RBracketLastIdx = rot.lastIndexOf(this.#rightSquareBracket);
    const hasValidRBracket = RBracketIdx !== -1 && RBracketIdx === RBracketLastIdx && RBracketIdx == rot.length - 1;

    const rightOrder = LBracketIdx < RBracketIdx;

    if (hasValidLBracket && hasValidRBracket && rightOrder) {
      return true;
    }

    if (LBracketIdx === -1 && RBracketIdx === -1) {
      return false;
    }

    throw new SyntaxError(`Bad array syntax '${rot}'.`);
  }

  /**
   * 是否含範圍語法
   */
  hasRange(rot: string) {
    const rangeIdx = rot.indexOf(this.#rangeSymbol);
    const rangeLastIdx = rot.lastIndexOf(this.#rangeSymbol);

    if (rangeIdx !== -1 && rangeIdx === rangeLastIdx) {
      return true;
    }

    if (rangeIdx === -1) {
      return false;
    }

    throw new SyntaxError(`Bad range syntax '${rot}'.`);
  }

  /**
   * 評估參數規則
   */
  evaluate(rule: ValidRule) {
    // 1. 字串時，分析語法並轉譯成驗證函式
    if (typeof rule === "string") {
      return this.#evaluateRuleLiteral(rule);
    }

    // 2. 函式時，驗證其參數及回傳值
    if (typeof rule === "function") {
      const { valid, msg } = rule("test", null) ?? {};

      const invalidRule = typeof valid !== "boolean" || (typeof msg !== "string" && msg !== null);

      if (invalidRule) {
        throw new Error("Invalid validator function.");
      }

      return rule;
    }

    // 3. 正規表達式時，直接轉換成驗證函式
    if (rule instanceof RegExp) {
      return (param: string, value: unknown) => {
        const valid = rule.test(value as string);
        const msg = `Parameter '${param}' does not conform to the regular expression '${rule}'.`;

        return { valid, msg };
      };
    }

    // 4. 不接受的格式
    throw new Error(`Invalid rule '${String(rule)}'.`);
  }

  /**
   * 分析並評估規則字串語法的主要函式
   */
  #evaluateRuleLiteral(rot: RuleLiteral) {
    // 1. 整理字串，排除所有空格並轉換為小寫
    rot = rot.replaceAll(" ", "");
    rot = rot.toLowerCase();

    // 2. 純型別時，直接生成驗證器並返回
    if (this.isPureType(rot)) {
      return this.#validatorGenerator({ type: rot });
    }

    // 3. 函其他語法時，先驗證是否有陣列語法
    return this.#arrayPipe(rot);
  }

  /**
   * 陣列語法分析管道
   */
  #arrayPipe(rot: RuleLiteral) {
    // 1. 不含陣列語法，直接返回數量限制語法管道
    if (!this.hasArray(rot)) {
      return this.#limitationPipe(rot);
    }

    // 2. 解構陣列語法
    const [_rot, _arrLimit] = rot.split(this.#leftSquareBracket);

    const arrLimit = _arrLimit.replace(this.#rightSquareBracket, "");

    const arrayOptions: Limitation = {};

    // 2-1. 陣列含有範圍語法時，解構它
    if (this.hasRange(arrLimit)) {
      let min: string | number, max: string | number;
      [min, max] = arrLimit.split(this.#rangeSymbol) as string[];

      const noMin = min === "";
      const noMax = max === "";
      const lackOfValue = noMin && noMax;

      min = +min as number;
      max = +max as number;

      const badSyntax = isNaN(min) || isNaN(max) || lackOfValue;

      if (badSyntax) {
        throw new SyntaxError(`Unexpected limitation of array '${arrLimit}'.`);
      }

      if (!noMin || min || min === 0) {
        arrayOptions.min = min;
      }

      if (!noMax || max || max === 0) {
        arrayOptions.max = max;
      }
    } else if (!isNaN(+arrLimit) && arrLimit !== "") {
      arrayOptions.equal = +arrLimit;
    } else if (arrLimit !== "") {
      throw new SyntaxError("Bad array limitation.");
    }

    // 3. 將剝除陣列語法後的規則語法、陣列配置，傳入數量限制語法管道
    return this.#limitationPipe(_rot, arrayOptions);
  }

  /**
   * 數量限制語法管道
   */
  #limitationPipe(rot: RuleLiteral, arrayOptions?: Limitation) {
    // 1. 解構數量限制語法
    const [type, limitation] = rot.split(this.#limitSymbol);

    // 1-1. 判斷型別是否存在
    if (!this.isPureType(type)) {
      throw new SyntaxError(`Unexpected type '${type}'.`);
    }

    const typeInfo = this.typeLib.get(type) as TypeMetadata;

    const result: Rule = { type, typeInfo };

    const configLimitation = (target: Limitation, targetKey: keyof Limitation, limitValue: number | undefined) => {
      const invalidLimit = !(limitValue || limitValue === 0);

      if (invalidLimit) {
        return;
      }

      target[targetKey] = limitValue;
    };

    // 2. 若有陣列配置時，將配置寫入結果
    if (arrayOptions) {
      const { min, max, equal } = arrayOptions;

      result.hasArray = true;

      const arrayLimitation: Limitation = {};

      configLimitation(arrayLimitation, "min", min);
      configLimitation(arrayLimitation, "max", max);
      configLimitation(arrayLimitation, "equal", equal);

      if (Object.keys(arrayLimitation).length) {
        result.arrayLimitation = arrayLimitation;
      }
    }

    // 3. 若沒有數量限制，直接返回生成驗證器，否則更新結果參數
    if (!limitation) {
      return this.#validatorGenerator(result);
    } else {
      result.limitation = true;
    }

    const { countable, allowBytes } = typeInfo;

    // 3-1. 型別不可數時，拋出例外
    if (!countable) {
      throw new SyntaxError(`Type '${type}' is uncountable.`);
    }

    const hasRange = this.hasRange(limitation);

    const typeLimitation: Limitation = {};

    // 4. 解構範圍語法
    if (hasRange) {
      let min: string | number | undefined, max: string | number | undefined;
      [min, max] = limitation.split(this.#rangeSymbol);

      const validLimit = (limit: string | number) =>
        limit === "" || (isNaN(+limit) && !this.byteConvertor.hasByteUnit(limit as string));

      const noMin = validLimit(min);
      const noMax = validLimit(max);
      const lackOfValue = noMin && noMax;

      if (lackOfValue) {
        throw new SyntaxError(`Unexpected limitation of type '${rot}'.`);
      }

      const illegalByte = !allowBytes && (this.byteConvertor.hasByteUnit(min) || this.byteConvertor.hasByteUnit(max));

      if (illegalByte) {
        throw new SyntaxError(`Type '${type}' cannot be measured in byte unit.`);
      }

      min = noMin ? undefined : this.byteConvertor.toNumber(min);
      max = noMax ? undefined : this.byteConvertor.toNumber(max);

      configLimitation(typeLimitation, "min", min);
      configLimitation(typeLimitation, "max", max);
    } else {
      const illegalByte = !allowBytes && this.byteConvertor.hasByteUnit(limitation);

      if (illegalByte) {
        throw new SyntaxError(`Type '${type}' cannot be measured in byte unit.`);
      }

      const equal = this.byteConvertor.toNumber(limitation);

      // console.log({ illegalByte, equal });

      configLimitation(typeLimitation, "equal", equal);
    }

    if (Object.keys(typeLimitation).length) {
      result.typeLimitation = typeLimitation;
    }

    // console.log({ type: result.type, result });

    // 5. 返回驗證器生成
    return this.#validatorGenerator(result);
  }

  /**
   * 生成驗證器
   */
  #validatorGenerator(options: Rule = { type: "any" }) {
    const {
      type,
      typeInfo = this.typeLib.get(type) as TypeMetadata,
      limitation = false,
      typeLimitation,
      hasArray = false,
      arrayLimitation,
    } = options;

    const { _type, measureUnit, test } = typeInfo;

    const subValidator: RuleValidator = (param, value) => {
      const typeExam = test(value);

      if (!typeExam) {
        return {
          valid: false,
          msg: `Parameter '${param}' must be in type '${_type}'.`,
        };
      } else if (!limitation) {
        return { valid: true, msg: null };
      }

      const msg = measureUnit
        ? `The ${measureUnit} of parameter '${param}' must be `
        : `The parameter '${param}' must be `;

      // console.log({ typeLimitation });

      return this.#rangeValidator(value, measureUnit, typeLimitation as Limitation, msg);
    };

    const validator: RuleValidator = (param, value) => {
      if (!hasArray) {
        return subValidator(param, value);
      }

      const _value = value as unknown[];

      if (arrayLimitation) {
        const arrayExam = this.#rangeValidator(
          value,
          "length",
          arrayLimitation,
          `The length of '${param}' array must be `,
        );

        if (!arrayExam.valid) {
          return arrayExam;
        }
      }

      for (const key in _value) {
        if (!Object.prototype.hasOwnProperty.call(_value, key)) {
          continue;
        }

        const value = _value[key];

        const _param = param + this.#leftSquareBracket + key + this.#rightSquareBracket;

        const typeExam = subValidator(_param, value);

        if (!typeExam.valid) {
          return typeExam;
        }
      }

      return { valid: true, msg: null } as RuleErrorOption;
    };

    return validator;
  }

  /**
   * 範圍驗證器
   */
  #rangeValidator(value: unknown, measureUnit: string | null, limitation: Limitation, msg: string): RuleErrorOption {
    const { min, max, equal } = limitation;

    const validEqual = equal !== undefined;
    const validMin = min !== undefined;
    const validMax = max !== undefined;

    let valid: boolean = true;
    const _value = (measureUnit ? (value as Record<string, unknown>)[measureUnit] : value) as number;

    if (validEqual) {
      valid = _value === equal;
      msg += `equal to ${equal}.`;
    } else if (validMin && validMax) {
      valid = _value >= min && _value <= max;
      msg += `not only greater than or equal to ${min}, but also less than or equal to ${max}.`;
    } else if (validMin) {
      valid = _value >= min;
      msg += `greater than or equal to ${min}.`;
    } else if (validMax) {
      valid = _value <= max;
      msg += `less than or equal to ${max}.`;
    }

    return { valid, msg };
  }
}
