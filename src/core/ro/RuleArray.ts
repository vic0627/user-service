import Injectable from "src/decorator/Injectable";
import StringRule from "./StringRule";
import { symbolToken } from "src/utils/common";
import type {
    RuleArrayExecutorArgs,
    RuleArrayQueueObject,
    RuleArrayType,
    ValidRule,
} from "src/types/ruleObject.type";
import type { RuleValidator } from "src/types/ruleLiteral.type";
import type { RuleErrorOption } from "src/types/ro/RuleError.type";
import Expose from "src/decorator/Expose";

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

    decalreUnion(...rules: ValidRule[]) {
        return this.#declare("union", rules);
    }

    decalreIntersection(...rules: ValidRule[]) {
        return this.#declare("intersection", rules);
    }

    find(token: symbol) {
        const queueObj = this.#queue.get(token);

        if (!queueObj) throw new Error("No such rule array has been found.");

        const { type, rules } = queueObj;

        return {
            type,
            rules,
            executor: (param: string, value: unknown) =>
                this.#execute({ type, rules, param, value }),
        };
    }

    #declare(type: RuleArrayType, rules: ValidRule[]) {
        const token = symbolToken(rules.toString());

        if (this.#queue.has(token))
            throw new Error(`Duplicate ${type} array detected.`);

        const _rules = this.#evaluate(rules) as RuleValidator[];

        this.#queue.set(token, { type, rules: _rules });

        return token;
    }

    #evaluate(rules: ValidRule[]) {
        return rules.map((rule) => {
            if (typeof rule === "string") return this.stringRule.evaluate(rule);

            if (typeof rule === "function") {
                const { valid, msg } = rule("test", null) ?? {};

                const invalidRule =
                    typeof valid !== "boolean" ||
                    (typeof msg !== "string" && msg !== null);

                if (invalidRule) throw new Error("Invalid validator function.");

                return rule;
            }

            if (rule instanceof RegExp)
                return (param: string, value: unknown) => {
                    const valid = rule.test(value as string);
                    const msg = `Parameter '${param}' does not conform to the regular expression '${rule}'.`;

                    return { valid, msg };
                };

            throw new Error(`Invalid rule '${rule}'.`);
        });
    }

    #execute({
        type,
        rules,
        param,
        value,
    }: RuleArrayExecutorArgs): RuleErrorOption {
        let exam: RuleErrorOption = { valid: false, msg: null };

        /**
         * @todo record correct msg according to the type of the value
         */
        let record = false;
        for (const i in rules) {
            const validator = rules[i];
            const { valid, msg } = validator(param, value);

            const union = type === "union";
            const intersection = type === "intersection";

            if (union) {
                if (!record || valid) {
                    exam = { valid, msg };
                    record = true;
                }

                if (valid) break;
            }

            if (intersection) {
                exam = { valid, msg };

                if (!valid) break;
            }
        }

        if (exam) return exam;

        throw new Error(
            "Validation progress failed in unexpected circumstance."
        );
    }
}
