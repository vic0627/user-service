import IOCContainer from "../decorator/IOCContainer";
import { Byte, ByteConvertor } from "../utils/Byte";
import TypeLib from "./ro/TypeLib";
import StringRule from "./ro/StringRule";
import RuleArray from "./ro/RuleArray";
import { ValidRule } from "src/types/ruleObject.type";
import { TypeValidator } from "src/types/ruleLiteral.type";

@IOCContainer({
    provides: [TypeLib, Byte, ByteConvertor],
    imports: [StringRule, RuleArray],
})
class Module {
    constructor(
        private readonly ruleArray: RuleArray,
        private readonly typeLib: TypeLib
    ) {}

    declareType(type: string, validator: TypeValidator) {
        return this.typeLib.declareType(type, validator);
    }

    declareUnion(...rules: ValidRule[]) {
        return this.ruleArray.decalreUnion(...rules);
    }

    declareIntersection(...rules: ValidRule[]) {
        return this.ruleArray.decalreIntersection(...rules);
    }
}

export default new Module({} as RuleArray, {} as TypeLib);
