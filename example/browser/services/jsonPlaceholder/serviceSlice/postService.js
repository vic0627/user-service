import { mergeRules, partialRules, pickRules } from "../../../../../dist/user-service.esm.js";

const positiveInt = "int@1:";

const headers = {
  "Content-type": "application/json; charset=UTF-8",
};

const postParam = ["title", "body", "userId"];

const postDTO = {
  title: "string@5:",
  body: "string",
  userId: positiveInt,
};

const idDTO = { id: positiveInt };

const onBeforeRequest = (payload) => JSON.stringify(payload);

/** @type {import("../../../../../dist/types/userService.type.js").ServiceConfigChild} */
export default {
  route: "posts",
  name: "post",

  api: [
    {
      name: "getAll",
      query: ["userId"],
      rules: pickRules(partialRules(idDTO), "userId"),
    },
    {
      name: "getById",
      param: ["id"],
      rules: idDTO,
    },
    {
      name: "create",
      method: "post",
      headers,
      body: postParam,
      rules: postDTO,
      onBeforeRequest,
    },
    {
      name: "update",
      method: "put",
      headers,
      param: ["id"],
      body: postParam,
      rules: mergeRules(idDTO, postDTO),
      onBeforeRequest,
    },
    {
      name: "modify",
      method: "patch",
      headers,
      param: ["id"],
      body: postParam,
      rules: mergeRules(idDTO, partialRules(postDTO)),
      onBeforeRequest,
    },
    {
      name: "delete",
      method: "delete",
      param: ["id"],
      rules: idDTO,
    },
  ],

  children: [
    {
      route: "comments",
      api: {
        query: ["postId"],
        rules: {
          postId: positiveInt,
        },
      },
    },
  ],
};
