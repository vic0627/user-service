import "reflect-metadata";
import UserService from "./core/UserService";

// export const { declareType, declareUnion, declareIntersection } = UserService;

export default UserService;

export const declareType = UserService.declareType.bind(UserService);
export const declareUnion = UserService.declareUnion.bind(UserService);
export const declareIntersection = UserService.declareIntersection.bind(UserService);
