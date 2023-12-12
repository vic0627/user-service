/** @type {import("../../../../../dist/types/userService.type.js").ServiceConfigChild} */
export default {
  route: "posts",
  name: "post",

  api: [
    {
      name: "getAll",
    },
    {
      name: "getById",
      param: ["id"],
      rules: {
        id: "int@1:",
      },
    },
    {
      name: "create",
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: {
        title: "string",
        body: "string",
        userId: "int@1:",
      },
      rules: {
        title: "string",
        body: "string",
        userId: "int@1:",
      },
      onBeforeRequest(payload) {
        return JSON.stringify(payload);
      },
    },
  ],
};
