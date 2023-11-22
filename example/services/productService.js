import { mergeRules, partialRules } from "user-service";

/** 以下為參數名稱及敘述 */

const limitAndSortDescription = {
    limit: "Limit results. No default value, and value >= 1.",
    sort: "Sort results. Default value is in ascending mode, you can use with 'desc' or 'asc' as you want.",
};

const idDescription = {
    id: "Identify number of product, and value >= 1.",
};

/** 以下為驗證規則物件 */

const positiveInt = "int@1:"; // 正整數

const productIdRule = { id: positiveInt };

const productRules = {
    title: "string@1:20", // 長度 >= 1 且 <= 20 的字串
    price: "number@0:", // 正數或 0
    description: "string@1:100", // 長度 >= 1 且 <= 100 的字串
    image: "file@:5mb", // <= 5mb 的 File 物件
    category: "string", // 字串
};

const productQueryRules = {
    /** $ 開頭為非必要參數，仍可設定驗證規則，將在收到值時執行驗證。 */
    $limit: positiveInt,
    $sort: (_, val) => {
        if (val !== "desc" || val !== "asc")
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
    /**
     * 結合 baseURL 的完整 url 會是 https://fakestoreapi.com/products
     */
    route: "products",

    /**
     * 可將最終返回的 API 重新命名
     */
    // name: "product",

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
            description: "Get all products",
            query: limitAndSortDescription,
            rules: productQueryRules,
        },
        /**
         * GET https://fakestoreapi.com/products/:id
         *
         * @example
         * $storeAPI.products.getById({ id })
         */
        {
            name: "getById",
            description: "Get a single product by id",
            param: idDescription,
            rules: productIdRule,
        },
        /**
         * POST https://fakestoreapi.com/products
         *
         * @example
         * $storeAPI.products.create({ title, price, description, image, category })
         */
        {
            name: "create",
            description: "Add new product",
            method: "POST",
            rules: productRules,
        },
        /**
         * PUT https://fakestoreapi.com/products/:id
         *
         * @example
         * $storeAPI.products.update({ id, title, price, description, image, category })
         */
        {
            name: "update",
            description: "Update a product's information",
            method: "PUT",
            param: idDescription,
            rules: mergeRules(productRules, productIdRule),
        },
        /**
         * PATCH https://fakestoreapi.com/products/:id
         *
         * @example
         * $storeAPI.products.modify({ id, title?, price?, description?, image?, category? })
         */
        {
            name: "modify",
            description: "Update a product's information partially",
            method: "PATCH",
            param: idDescription,
            rules: mergeRules(partialRules(productRules), productIdRule),
        },
        /**
         * DELETE https://fakestoreapi.com/products/:id
         *
         * @example
         * $storeAPI.products.delete({ id })
         */
        {
            name: "delete",
            description: "Delete a product by id",
            method: "DELETE",
            param: idDescription,
            rules: productIdRule,
        },
    ],

    /**
     * 子路由
     */
    chirdren: [
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
            description: "Get all categories",
            /** 若設定 cache(預設 false)，重複請求時若無參數變動將會返回上次所記錄的值 */
            cache: true,
        },
        {
            route: "category",

            /** 使用物件作為參數，默認此路徑只有一個方法 */
            api: {
                /**
                 * GET https://fakestoreapi.com/products/category?limit=<LIMIT>&sort=<SORT>
                 *
                 * @example
                 * $storeAPI.products.getProductsIn({ limit?, sort? })
                 */
                name: "getProductsIn",
                param: { category: "Name of the category" },
                query: limitAndSortDescription,
                rules: mergeRules(productQueryRules, { category: "string" }),
                cache: true,
            },
        },
    ],
};
