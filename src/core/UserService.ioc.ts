import IOCContainer from "../decorator/IOCContainer.decorator";
import { Byte, ByteConvertor } from "../utils/Byte.provider";
import TypeLib from "./validationEngine/TypeLib.provider";
import StringRule from "./validationEngine/StringRule.injectable";
import RuleArray from "./validationEngine/RuleArray.injectable";
import { RuleObjectInterface, ValidRule } from "src/types/ruleObject.type";
import { TypeValidator } from "src/types/ruleLiteral.type";
import RuleObject from "./validationEngine/RuleObject.injectable";
import XHR from "./requestHandler/XHR.provider";

@IOCContainer({
    provides: [TypeLib, Byte, ByteConvertor, XHR],
    imports: [StringRule, RuleArray, RuleObject],
})
class Module {
    constructor(
        private readonly ruleArray: RuleArray,
        private readonly typeLib: TypeLib,
        private readonly ruleObject: RuleObject,
        private readonly xhr: XHR
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

    mergeRules(...targets: RuleObjectInterface[]) {
        return this.ruleObject.mergeRules(...targets);
    }

    partialRules(target: RuleObjectInterface) {
        return this.ruleObject.partialRules(target);
    }

    requiredRules(target: RuleObjectInterface) {
        return this.ruleObject.requiredRules(target);
    }

    pickRules(target: RuleObjectInterface, ...args: string[]) {
        return this.ruleObject.pickRules(target, ...args);
    }

    omitRules(target: RuleObjectInterface, ...args: string[]) {
        return this.ruleObject.omitRules(target, ...args);
    }

    evaluate(rule: RuleObjectInterface) {
        return this.ruleObject.evaluate(rule);
    }

    getXHR() {
        return this.xhr;
    }
}

export default new Module(
    {} as RuleArray,
    {} as TypeLib,
    {} as RuleObject,
    {} as XHR
);
