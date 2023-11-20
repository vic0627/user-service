import "reflect-metadata";
import UserService from "./core/UserService.ioc";

const {
    defineType,
    defineUnion,
    defineIntersection,
    mergeRules,
    partialRules,
    requiredRules,
    pickRules,
    omitRules,
    evaluate,
} = UserService;

export default {
    defineType: defineType.bind(UserService),
    defineUnion: defineUnion.bind(UserService),
    defineIntersection: defineIntersection.bind(UserService),
    mergeRules: mergeRules.bind(UserService),
    partialRules: partialRules.bind(UserService),
    requiredRules: requiredRules.bind(UserService),
    pickRules: pickRules.bind(UserService),
    omitRules: omitRules.bind(UserService),
    evaluate: evaluate.bind(UserService),
};
