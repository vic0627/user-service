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

/**
 * encapsulate API routes or endpoints and generate a root service
 *
 * @description routes of final APIs that were output by this method are according to your configuration
 *
 * @param serviceConfig configuration of service
 * @returns instance of class Serivce, the final user interface,
 * all the routes and APIs will be defined as a property or method on it
 *
 * @example
 *
 * // 1. create a store service
 * const storeService = createService({
 *    baseURL: 'localhost:5678',
 *    name: 'storeAPI',
 *    api: { name: 'getAll' },
 *    children: [
 *      {
 *        route: 'products',
 *        api: [
 *          { name: 'getAll' },
 *          { name: 'getById', param: ['id'] },
 *        ]
 *      },
 *      { route: 'categrories', name: 'getAllCategrories' },
 *    ]
 * })
 *
 * // 2. access store service directly via variable
 * storeService.getAll()
 * storeService.products.getAll()
 * storeService.products.getById({ id: 3 })
 * storeService.categrories()
 *
 * // 3. mount the service on a global object and accessing service via the global object
 * storeService.mount(window)
 *
 * // 3-1. the service will automatically transform into the name you've gived to the root configuration
 * window.$storeAPI.getAll()
 * window.$storeAPI.products.getAll()
 * window.$storeAPI.products.getById({ id: 3 })
 * window.$storeAPI.categrories()
 */
export const createService = us.createService.bind(us);
/**
 * generate FormData based on the given object
 *
 * @param object expect an iterable object
 * @param deep receive true, or any other value that can be implicitly casting into true,
 * will dig out all the nested object and append values to the FormData
 *
 * @example
 *
 * // 1. define an object
 * const payload = {
 *    id: 1,
 *    user: {
 *      name: 'victor'
 *    }
 * }
 *
 * // 2. generate FormData
 * const fd = createFormData(payload)
 * // is equal to...
 * const fd = new FormData()
 * fd.append('id', payload.id)
 * fd.append('user', payload.user)
 *
 * // 3. generate FormData with passing true to the parameter 'deep'
 * const fd = createFormData(payload, true)
 * // is equal to...
 * const fd = new FormData()
 * fd.append('id', payload.id)
 * fd.append('user[name]', payload.user.name)
 */
export const createFormData = us.createFormData.bind(us);
/**
 * add a custom type to the type library of user-service
 *
 * @warn custom types do not shared with different root services,
 * which means one custom type can only be re-used in a same service
 *
 * @param type name of the custom type
 * @param validator a function to validate if an value matches the custom type
 *
 * @example
 *
 * // 1. define a custom type
 * const notReseverdName = defineType('nrn', (value) => !['victor', 'yvonne'].some((name) => value.includes(name)))
 *
 * // 2. use it in the rule object
 * export default {
 *    // ...
 *    api: {
 *      name: 'thisIsAMethodName',
 *      body: { name: 'this is a parameter of this method' }
 *      rules: { name: ['string', notReseverdName] },
 *      // or
 *      rules: { name: ['string', 'nrn'] },
 *    }
 * }
 */
export const defineType = us.defineType.bind(us);
/**
 * Treat multiple rules as the intersection of sets
 *
 * @param rules valid rules
 * @returns token of the intersection rule, directly assign it to any property of the rule object
 *
 * @todo continue doc writing...
 */
export const defineIntersection = us.defineIntersection.bind(us);
export const defineUnion = us.defineUnion.bind(us);
export const mergeRules = us.mergeRules.bind(us);
export const partialRules = us.partialRules.bind(us);
export const requiredRules = us.requiredRules.bind(us);
export const omitRules = us.omitRules.bind(us);
export const pickRules = us.pickRules.bind(us);

export default us;
