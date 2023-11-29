import Injectable from "src/decorator/Injectable.decorator";
import StringRule from "./StringRule.injectable";
import { symbolToken } from "src/utils/common";
import { RuleArrayExecutorArgs, RuleArrayQueueObject, RuleArrayType, ValidRule } from "src/types/ruleObject.type";
import type { RuleValidator } from "src/types/ruleLiteral.type";
import type { RuleErrorOption } from "src/types/ruleError.type";
import Expose from "src/decorator/Expose.decorator";

@Expose()
@Injectable()
export default class RuleArray {
  /**
   * All the rule arrays must be evaluated before being stored in queue.
   */
  #queue: Map<symbol, RuleArrayQueueObject> = new Map();

  get size() {
    return this.#queue.size;
  }

  constructor(private readonly stringRule: StringRule) {}

  defineUnion(...rules: ValidRule[]) {
    return this.#define(RuleArrayType.union, rules);
  }

  defineIntersection(...rules: ValidRule[]) {
    return this.#define(RuleArrayType.intersection, rules);
  }

  find(token: symbol) {
    const queueObj = this.#queue.get(token);

    if (!queueObj) {
      throw new Error("No such rule array has been found.");
    }

    const { type, rules } = queueObj;

    return {
      type,
      rules,
      executor: (param: string, value: unknown) => this.#execute({ type, rules, param, value }),
    };
  }

  #define(type: RuleArrayType, rules: ValidRule[]) {
    const token = symbolToken(rules.toString());

    if (this.#queue.has(token)) {
      throw new Error(`Duplicate ${type} array detected.`);
    }

    const _rules = this.#evaluate(rules) as RuleValidator[];

    this.#queue.set(token, { type, rules: _rules });

    return token;
  }

  #evaluate(rules: ValidRule[]) {
    return rules.map((rule) => this.stringRule.evaluate(rule));
  }

  #execute({ type, rules, param, value }: RuleArrayExecutorArgs): RuleErrorOption {
    let exam: RuleErrorOption = { valid: false, msg: null };

    /**
     * @todo record correct msg according to the type of the value
     */
    let record = false;

    for (const i in rules) {
      const validator = rules[i];
      const { valid, msg } = validator(param, value);

      const union = type === RuleArrayType.union;
      const intersection = type === RuleArrayType.intersection;

      if (union) {
        if (!record || valid) {
          exam = { valid, msg };
          record = true;
        }

        if (valid) {
          break;
        }
      }

      if (intersection) {
        exam = { valid, msg };

        if (!valid) {
          break;
        }
      }
    }

    if (exam) {
      return exam;
    }

    throw new Error("Validation progress failed in unexpected circumstance.");
  }
}
