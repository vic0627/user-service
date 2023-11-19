import Injectable from "src/decorator/Injectable.decorator";
import StringRule from "./StringRule.injectable";
import RuleArray from "./RuleArray.injectable";
// import TypeLib from "./TypeLib";
// import { RuleObjectInterface } from "src/types/ruleObject.type";

@Injectable()
export default class RuleObject {
    constructor(
        private readonly stringRule: StringRule,
        private readonly ruleArray: RuleArray
    ) {}

    // validate(target: Record<string, unknown>, rule: RuleObjectInterface) {
        
    // }

    
}