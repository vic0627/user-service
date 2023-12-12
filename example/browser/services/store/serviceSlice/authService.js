import { defineIntersection } from "../../../../../dist/user-service.esm.js";

/**
 * defineIntersection()
 * 為定義類似 TS intersection type 的方法，即同時必須符合所有驗證規則
 *
 * 另有
 * defineType(typeName: string, validator: (value: unknown) => boolean): symbol
 * 用來定義基本型別
 *
 * 以及
 * defineUnion()
 * 用來定義類似 TS 的 union type
 */

const usernameIntersectionRules = defineIntersection("string@3:15", (_, value) => {
  if (typeof value === "string")
    return {
      valid: !value.includes("習近平"),
      msg: "使用者名稱不可包含敏感字元",
    };
  else
    return {
      valid: false,
      msg: "型別錯誤",
    };
});

export default {
  /**
   * 子路徑可依情境擁有多層
   */
  route: "auth/login",

  /**
   * 此時若不設定 name，返回的 api 將會取 route 的第一層來使用
   *
   * @example
   * // 無 name
   * $storeAPI.auth()
   * // 有 name
   * $storeAPI.login()
   */

  api: {
    name: "login",
    method: "POST",
    rules: {
      username: usernameIntersectionRules,
      password: "string@8:20",
    },
  },
};
