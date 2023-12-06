import "reflect-metadata";
import UserService from "./core/UserService.ioc";

const userService = () => {
  const _us = new UserService();

  const defineType = _us?.TypeLib?.defineType.bind(_us?.TypeLib);
  const defineUnion = _us?.RuleArray?.defineUnion.bind(_us?.RuleArray);
  const defineIntersection = _us?.RuleArray?.defineIntersection.bind(_us?.RuleArray);
  const mergeRules = _us?.RuleObject?.mergeRules.bind(_us?.RuleObject);
  const partialRules = _us?.RuleObject?.partialRules.bind(_us?.RuleObject);
  const requiredRules = _us?.RuleObject?.requiredRules.bind(_us?.RuleObject);
  const pickRules = _us?.RuleObject?.pickRules.bind(_us?.RuleObject);
  const omitRules = _us?.RuleObject?.omitRules.bind(_us?.RuleObject);
  const createService = _us?.ServiceFactory?.createService.bind(_us?.ServiceFactory);

  const scheduledTask = _us?.ScheduledTask;

  return {
    _us,
    scheduledTask,
    defineType,
    defineUnion,
    defineIntersection,
    mergeRules,
    partialRules,
    requiredRules,
    pickRules,
    omitRules,
    createService,
  };
};

export default userService;
