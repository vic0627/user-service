import "reflect-metadata";
import UserService from "./core/UserService";

export default UserService;

export const defineType = UserService.defineType.bind(UserService);
export const defineUnion = UserService.defineUnion.bind(UserService);
export const defineIntersection = UserService.defineIntersection.bind(UserService);
