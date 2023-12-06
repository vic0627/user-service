import IOCContainer from "../decorator/IOCContainer.decorator";
import { Byte, ByteConvertor } from "../utils/Byte.provider";
import TypeLib from "./validationEngine/TypeLib.provider";
import StringRule from "./validationEngine/StringRule.injectable";
import RuleArray from "./validationEngine/RuleArray.injectable";
import RuleObject from "./validationEngine/RuleObject.injectable";
import XHR from "./requestHandler/requestStrategy/XHR.provider";
import ServiceFactory from "./serviceLayer/ServiceFactory.injectable";
import APIFactory from "./requestHandler/APIFactory.injectable";
import CacheManager from "./requestHandler/requestPipe/CacheManager.injectable";
import PromiseInterceptors from "./requestHandler/requestPipe/PromiseInterceptors.provider";
import ScheduledTask from "./scheduledTask/ScheduledTask.provider";
import WebStorage from "./requestHandler/requestPipe/cacheStrategy/WebStorage.provider";

@IOCContainer({
  provides: [TypeLib, Byte, ByteConvertor, XHR, PromiseInterceptors, ScheduledTask, WebStorage],
  imports: [StringRule, RuleArray, RuleObject, ServiceFactory, APIFactory, CacheManager],
})
class Module {
  // 有 @Expose() 的模組
  TypeLib?: TypeLib;
  RuleArray?: RuleArray;
  RuleObject?: RuleObject;
  ServiceFactory?: ServiceFactory;
  ScheduledTask?: ScheduledTask;
}

export default Module;
