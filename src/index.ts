import "reflect-metadata";
import UserService from "./core/UserService.ioc";
import ScheduledTask from "./core/scheduledTask/ScheduledTask.provider";
import ServiceFactory from "./core/serviceLayer/ServiceFactory.injectable";
import RuleArray from "./core/validationEngine/RuleArray.injectable";
import RuleObject from "./core/validationEngine/RuleObject.injectable";
import TypeLib from "./core/validationEngine/TypeLib.provider";
import ServiceFormData from "./core/formData/ServcieFormData.provider";

const userService = () => {
  const us = new UserService(
    {} as ScheduledTask,
    {} as ServiceFactory,
    {} as RuleArray,
    {} as RuleObject,
    {} as TypeLib,
    {} as ServiceFormData,
  );

  const {
    scheduledTask,
    createService,
    createFormData,
    defineType,
    defineIntersection,
    defineUnion,
    mergeRules,
    partialRules,
    requiredRules,
    omitRules,
    pickRules,
  } = us;

  return {
    scheduledTask,
    createService: createService.bind(us),
    createFormData: createFormData.bind(us),
    defineType: defineType.bind(us),
    defineIntersection: defineIntersection.bind(us),
    defineUnion: defineUnion.bind(us),
    mergeRules: mergeRules.bind(us),
    partialRules: partialRules.bind(us),
    requiredRules: requiredRules.bind(us),
    omitRules: omitRules.bind(us),
    pickRules: pickRules.bind(us),
  };
};

export default userService;
