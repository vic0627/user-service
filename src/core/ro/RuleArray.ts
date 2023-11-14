import Injectable from "src/decorator/Injectable";
import { RuleEvaluation, ValidRule } from "src/types/ruleObject.type";
import { StringRule } from "./StringRule";

abstract class RuleArray {
    queue = new Map<symbol, ValidRule>();
    validationQueue = new Map<symbol, ValidRule>();

    get length() {
        return this.queue.size;
    }

    evaluate(): void {}

    execute(): void {}

    decalreUnion?(...rules: ValidRule[]): symbol;
    decalreIntersection?(...rules: ValidRule[]): symbol;
}

@Injectable()
export class UnionRuleArray implements RuleArray {
    queue: Map<symbol, ValidRule> = new Map();
    validationQueue: Map<symbol, ValidRule> = new Map();

    get length() {
        return this.queue.size;
    }

    constructor(private readonly stringRule: StringRule) {}

    evaluate() {}

    execute() {}

    decalreUnion(...rules: ValidRule[]) {
        const token = Symbol.for(rules.toString());

        if (this.queue.has(token)) throw new Error('Duplicate union array detected.')

        return token;
    }
}
