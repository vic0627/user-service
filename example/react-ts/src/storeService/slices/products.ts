import { createFormData, mergeRules, partialRules } from "@user-service";
import type { ServiceConfigChild } from "@user-service/userService.type";
import { Payload } from "@user-service/ruleObject.type";

export const limitAndSortDescription = {
  limit: "回傳商品數量限制，正整數",
  sort: "排序方式，預設升冪排列",
};

const idDescription = {
  id: "商品 id，正整數",
};

export const positiveInt = "int@1:";

const productIdRule = { id: positiveInt };

const productRules = {
  title: "string@1:20",
  price: "number@0:",
  description: "string@1:100",
  image: "file@:5mb",
  category: "string",
};

const onBeforeRequest = (payload: Payload) => {
  if (payload.image) payload.image = btoa(payload.image as string);
  const req = createFormData(payload);

  return req;
};

const onBeforeValidation = (payload: Payload) => {
  if (payload.price !== undefined && typeof payload.price !== "number") payload.price = Number(payload.price);
  if (payload.id !== undefined && typeof payload.id !== "number") payload.id = Number(payload.id);
};

const productDescription = {
  title: "商品標題",
  price: "商品價格",
  description: "商品描述",
  image: "商品圖片",
  category: "商品分類",
};

export const productQueryRules = {
  $limit: positiveInt,
  $sort: (_: string, val: unknown) => {
    if (val !== "desc" && val !== "asc")
      return {
        valid: false,
        msg: `"Property 'sort' could only be 'desc' or 'asc'.`,
      };

    return {
      valid: true,
      msg: null,
    };
  },
};

export default {
  route: "products",

  onBeforeValidation,
  onBeforeRequest,
  api: [
    {
      name: "getAll",
      description: "取得所有商品訊息。",
      query: limitAndSortDescription,
      rules: productQueryRules,
      cache: true,
      onBeforeRequest() {},
    },
    {
      name: "getById",
      description: "依 id 取得單項商品訊息。",
      param: idDescription,
      rules: productIdRule,
      cache: true,
      onBeforeRequest() {},
    },
    {
      name: "create",
      description: "新增商品。",
      method: "POST",
      body: productDescription,
      rules: productRules,
    },
    {
      name: "update",
      description: "更新商品資訊(整體)。",
      method: "PUT",
      param: idDescription,
      body: productDescription,
      rules: mergeRules(productRules, productIdRule),
    },
    {
      name: "modify",
      description: "更新商品資訊(局部)。",
      method: "PATCH",
      param: idDescription,
      body: productDescription,
      rules: mergeRules(partialRules(productRules), productIdRule),
    },
    {
      name: "delete",
      description: "依 id 刪除商品",
      method: "DELETE",
      param: idDescription,
      rules: productIdRule,
    },
  ],
  children: [
    {
      route: "categories",
      name: "getCategories",
      cache: true,
    },
    {
      route: "category",
      name: "getProductsIn",
      api: {
        param: { category: "商品分類" },
        query: limitAndSortDescription,
        rules: mergeRules(productQueryRules, { category: "string" }),
        cache: true,
      },
    },
  ],
} as ServiceConfigChild;
