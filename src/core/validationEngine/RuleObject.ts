import Injectable from "src/decorator/Injectable";
import StringRule from "./StringRule";
import RuleArray from "./RuleArray";
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