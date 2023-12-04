import type { ServiceConfigRoot } from "src/types/userService.type";
import type { RuleObjectInterface, ValidRule } from "src/types/ruleObject.type";
import type { TypeValidator } from "src/types/ruleLiteral.type";
import IOCContainer from "../decorator/IOCContainer.decorator";
import { Byte, ByteConvertor } from "../utils/Byte.provider";
import TypeLib from "./validationEngine/TypeLib.provider";
import StringRule from "./validationEngine/StringRule.injectable";
import RuleArray from "./validationEngine/RuleArray.injectable";
import RuleObject from "./validationEngine/RuleObject.injectable";
import XHR from "./requestHandler/requestStrategy/XHR.provider";
import ServiceFactory from "./serviceLayer/ServiceFactory.injectable";
import APIFactory from "./requestHandler/APIFactory.injectable";
import CacheManager from "./requestHandler/requestPipe/CacheManager.provider";
import PromiseInterceptors from "./requestHandler/requestPipe/PromiseInterceptors.provider";
import ScheduledTask from "./scheduledTask/ScheduledTask.provider";

@IOCContainer({
  provides: [TypeLib, Byte, ByteConvertor, XHR, CacheManager, PromiseInterceptors, ScheduledTask],
  imports: [StringRule, RuleArray, RuleObject, ServiceFactory, APIFactory],
})
class Module {
  constructor(
    private readonly ruleArray: RuleArray,
    private readonly typeLib: TypeLib,
    private readonly ruleObject: RuleObject,
    private readonly serviceFactory: ServiceFactory,
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

  createService(serviceConfig: ServiceConfigRoot) {
    return this.serviceFactory.createService(serviceConfig);
  }
}

export default new Module({} as RuleArray, {} as TypeLib, {} as RuleObject, {} as ServiceFactory);
