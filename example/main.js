import { createService } from "user-service";
import authService from "./services/authService";
import productService from "./services/productService";

/**
 * 使用此方法創建 API 抽象層
 */
const us = createService({
    baseURL: "https://fakestoreapi.com/",

    /** 服務名稱 */
    namespace: "storeAPI",

    /** 啟用參數驗證 */
    validation: true,

    /** 子路由 */
    children: [productService, authService],

    /** 請求頭配置 */
    // headers: {}

    /** @規劃中 攔截器的 hooks */

    /** 攔截器 - 驗證前 */
    onBeforeValidate: (payload) => {
        // ...
    },

    /** 攔截器 - 請求成功 */
    onSuccess: (res) => {
        const { status, data } = res;

        if (status !== 200) return null;

        return data;
    },

    /** 攔截器 - 請求失敗 */
    onError: (err) => {
        alert(err.message);
    },
});


/**
 * @規劃中 掛載到全域物件
 */
us.mount(window);