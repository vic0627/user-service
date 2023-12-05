import us from "../../../../dist/user-service.esm.js";
const { mergeRules, partialRules } = us;

/** 以下為參數名稱及敘述 */

export const limitAndSortDescription = {
  limit: "回傳商品數量限制，正整數",
  sort: "排序方式，預設升冪排列",
};

const idDescription = {
  id: "商品 id，正整數",
};

/** 以下為驗證規則物件 */

export const positiveInt = "int@1:"; // 正整數

const productIdRule = { id: positiveInt };

const productRules = {
  title: "string@1:20", // 長度 >= 1 且 <= 20 的字串
  price: "number@0:", // 正數或 0
  description: "string@1:100", // 長度 >= 1 且 <= 100 的字串
  image: "file@:5mb", // <= 5mb 的 File 物件
  category: "string", // 字串
};

const onBeforeRequest = (payload) => {
  if (payload.image) payload.image = btoa(payload.image);
};

const productDescription = {
  title: "商品標題",
  price: "商品價格",
  description: "商品描述",
  image: "商品圖片",
  category: "商品分類",
};

export const productQueryRules = {
  /** $ 開頭為非必要參數，仍可設定驗證規則，將在收到值時執行驗證。 */
  $limit: positiveInt,
  $sort: (_, val) => {
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

/** @type {import("../../../../src/types/userService.type.js").ServiceConfigChild} */
export default {
  /**
   * 結合 baseURL 的完整 url 會是 https://fakestoreapi.com/products
   */
  route: "products",

  /**
   * 可將最終返回的 API 重新命名
   */
  // name: "products",

  description: "獲取虛擬商店中的所有商品數據，包括商品名稱、價格、描述等詳細信息。",

  /**
   * api 為根據同層的 route 上的方法，可為 object literal(單一方法) 或 array(多個方法)
   */
  api: [
    /**
     * GET https://fakestoreapi.com/products?limit=<LIMIT>&sort=<SORT>
     * 若無設定 method 預設為 GET
     *
     * @example
     * $storeAPI.products.getAll()
     */
    {
      name: "getAll",
      description: "取得所有商品訊息。",
      query: limitAndSortDescription,
      rules: productQueryRules,
      cache: true,
    },
    /**
     * GET https://fakestoreapi.com/products/:id
     *
     * @example
     * $storeAPI.products.getById({ id })
     */
    {
      name: "getById",
      description: "依 id 取得單項商品訊息。",
      param: idDescription,
      rules: productIdRule,
      cache: true,
    },
    /**
     * POST https://fakestoreapi.com/products
     *
     * @example
     * $storeAPI.products.create({ title, price, description, image, category })
     */
    {
      name: "create",
      description: "新增商品。",
      method: "POST",
      body: productDescription,
      rules: productRules,
      interceptor: {
        onBeforeRequest,
      },
    },
    /**
     * PUT https://fakestoreapi.com/products/:id
     *
     * @example
     * $storeAPI.products.update({ id, title, price, description, image, category })
     */
    {
      name: "update",
      description: "更新商品資訊(整體)。",
      method: "PUT",
      param: idDescription,
      body: productDescription,
      rules: mergeRules(productRules, productIdRule),
      interceptor: {
        onBeforeRequest,
      },
    },
    /**
     * PATCH https://fakestoreapi.com/products/:id
     *
     * @example
     * $storeAPI.products.modify({ id, title?, price?, description?, image?, category? })
     */
    {
      name: "modify",
      description: "更新商品資訊(局部)。",
      method: "PATCH",
      param: idDescription,
      body: productDescription,
      rules: mergeRules(partialRules(productRules), productIdRule),
      interceptor: {
        onBeforeRequest,
      },
    },
    /**
     * DELETE https://fakestoreapi.com/products/:id
     *
     * @example
     * $storeAPI.products.delete({ id })
     */
    {
      name: "delete",
      description: "依 id 刪除商品",
      method: "DELETE",
      param: idDescription,
      rules: productIdRule,
    },
  ],

  /**
   * 子路由
   */
  children: [
    {
      /**
       * GET https://fakestoreapi.com/products/categories
       * 若無 api 參數，則所有設定將為預設值，默認此路徑只有一個 GET 方法
       * 此行為只會發生在 children route 上
       *
       * @example
       * $storeAPI.products.getCategories()
       */
      route: "categories",
      name: "getCategories",
      description: "取得所有商品種類。",
      cache: true,
    },
    {
      route: "category",
      name: "getProductsIn",
      description: "取得特定種類所有商品。",

      /** 使用物件作為參數，默認此路徑只有一個方法 */
      api: {
        /**
         * GET https://fakestoreapi.com/products/category?limit=<LIMIT>&sort=<SORT>
         *
         * @example
         * $storeAPI.products.getProductsIn({ limit?, sort?, category })
         */
        param: { category: "商品分類" },
        query: limitAndSortDescription,
        rules: mergeRules(productQueryRules, { category: "string" }),
        cache: true,
      },
    },
  ],
};
