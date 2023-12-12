import "reflect-metadata";
import UserService from "./core/UserService.ioc";
import ScheduledTask from "./core/scheduledTask/ScheduledTask.provider";
import ServiceFactory from "./core/serviceLayer/ServiceFactory.injectable";
import RuleArray from "./core/validationEngine/RuleArray.injectable";
import RuleObject from "./core/validationEngine/RuleObject.injectable";
import TypeLib from "./core/validationEngine/TypeLib.provider";
import ServiceFormData from "./core/formData/ServcieFormData.provider";

const us = new UserService(
  {} as ScheduledTask,
  {} as ServiceFactory,
  {} as RuleArray,
  {} as RuleObject,
  {} as TypeLib,
  {} as ServiceFormData,
);

export const { scheduledTask } = us;

export const createService = us.createService.bind(us);
export const createFormData = us.createFormData.bind(us);
export const defineType = us.defineType.bind(us);
export const defineIntersection = us.defineIntersection.bind(us);
export const defineUnion = us.defineUnion.bind(us);
export const mergeRules = us.mergeRules.bind(us);
export const partialRules = us.partialRules.bind(us);
export const requiredRules = us.requiredRules.bind(us);
export const omitRules = us.omitRules.bind(us);
export const pickRules = us.pickRules.bind(us);

export default us;
