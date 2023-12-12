import storeServcie from "./storeServcie.js";
import { limitAndSortDescription, productQueryRules, positiveInt } from "./productService.js";

storeServcie.defineType("cartitem", (value) => value?.productId > 0 && value?.quantity > 0);

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const cartIdDescription = { cartId: "購物車索引值" };

const cartIdRule = { cartId: positiveInt };

const userIdRule = { userId: positiveInt };

const cartItemRules = storeServcie.mergeRules(userIdRule, {
  date: dateRegex,
  products: "cartitem[]",
});

const updateCartRules = storeServcie.mergeRules(cartItemRules, cartIdRule);

const cartDescription = {
  userId: "使用者索引",
  date: "新增日期",
  products: "欲新增至購物車之商品",
};

export default {
  route: "carts",
  description: "模擬購物車功能的 API，用於模擬電子商務網站中與購物車相關的操作。",
  api: [
    {
      name: "getAll",
      description: "獲取所有購物車的內容或相關信息。",
      query: Object.assign(
        {
          startdate: "",
          enddate: "",
        },
        limitAndSortDescription,
      ),
      rules: storeServcie.mergeRules(productQueryRules, {
        $startdate: dateRegex,
        $enddate: dateRegex,
      }),
    },
    {
      name: "get",
      description: "獲取單一個購物車的內容或相關信息。",
      param: cartIdDescription,
      rules: cartIdRule,
    },
    {
      name: "add",
      description: "將單/多項商品新增指購物車。",
      method: "post",
      body: cartDescription,
      rules: cartItemRules,
    },
    {
      name: "modify",
      description: "修飾單一個購物車的內容或相關信息。",
      method: "put",
      param: cartIdDescription,
      body: cartDescription,
      rules: updateCartRules,
    },
    {
      name: "update",
      description: "更新單一個購物車的所有內容或相關信息。",
      method: "patch",
      param: cartIdDescription,
      body: cartDescription,
      rules: updateCartRules,
    },
    {
      name: "delete",
      description: "摻除單一個購物車的內容或相關信息。",
      method: "delete",
      param: cartIdDescription,
      rules: cartIdRule,
    },
  ],
  children: [
    {
      route: "user",
      name: "getByUser",
      description: "獲取特定用戶購物車的內容或相關信息。",
      api: {
        param: { userId: "使用者索引" },
        rules: userIdRule,
      },
    },
  ],
};
