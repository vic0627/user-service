import { createService } from "user-service";
import authService from "./services/authService";
import productService from "./services/productService";

/** @type {import("../src/types/userService.type.ts").ServiceConfig} */
const service = {
    /** 基本 url，root service 限定屬性 */
    baseURL: "https://fakestoreapi.com/",

    /** 服務名稱 */
    name: "storeAPI",

    /** 服務描述 */
    description: "假的商店",

    /** 啟用參數驗證 */
    validation: true,

    /** 子路由 */
    children: [productService, authService],

    /** 請求頭配置 */
    headers: {},

    /** 授權配置 */
    auth: {
        username: "",
        password: ""
    },

    /** 超時(ms) */
    timeout: 0,

    /** 超時錯誤訊息 */
    timeoutErrorMessage: "",

    /** 回覆格式 */
    responseType: "",

    /** 回覆 header 是否自動轉換為物件 */
    headerMap: true,
    
    /** 是否啟用快取 */
    cache: false,

    /** 路由，children 限定屬性 */
    // route: "",

    /** api 配置 */
    // api: [],

    /** @規劃中 攔截器的 hooks */
    /** 攔截器 - 驗證前 */
    /** 攔截器 - 請求成功 */
    /** 攔截器 - 請求失敗 */
};

/**
 * 使用此方法創建 API 抽象層
 */
const us = createService(service);

/**
 * @規劃中 掛載到全域物件
 * 掛載後會以 root service 的 name 重新命名，若沒有配置 root name，預設會是 `$serviceAPI`。
 */
us.mount(window);

/**
 * 透過 us 或掛載後的 service 呼叫 api
 */
us.products.getAll();
// or
// 設置 root name 為 `storeAPI`
window.$storeAPI.products.getAll();
// 無 root name
window.$serviceAPI.products.getAll();