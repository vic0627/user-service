import IOCContainer from "../decorator/IOCContainer.decorator";
import { Byte, ByteConvertor } from "../utils/Byte.provider";
import TypeLib from "./validationEngine/TypeLib.provider";
import StringRule from "./validationEngine/StringRule.injectable";
import RuleArray from "./validationEngine/RuleArray.injectable";
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

    defineType(type: string, validator: TypeValidator) {
        return this.typeLib.defineType(type, validator);
    }

    defineUnion(...rules: ValidRule[]) {
        return this.ruleArray.defineUnion(...rules);
    }

    defineIntersection(...rules: ValidRule[]) {
        return this.ruleArray.defineIntersection(...rules);
    }
}

export default new Module({} as RuleArray, {} as TypeLib);
