import us from "../../../dist/user-service.esm.js";
import authService from "./serviceSlice/authService.js";
import productService from "./serviceSlice/productService.js";
import cartService from "./serviceSlice/cartService.js";
import foolProof from "../js/components/foolProof.js";

const { createService } = us;

/**
 * 非該 node level 限定的 Configuration 會往下(children, api)繼承，越 deep 的 config 權重越大。
 */

/** @type {import("../../../src/types/userService.type.js").ServiceConfigRoot} */
const service = {
  baseURL: "https://fakestoreapi.com/",
  name: "storeAPI",
  description:
    "FakeStoreAPI 是一個提供虛擬商店數據的開發者友好的公開 API。這個 API 提供了各種模擬真實電商環境中所需的端點，包括商品、購物車、訂單等，以方便開發者測試和開發電商相關的應用程式。",
  children: [productService, authService, cartService],
  // headers: {},
  // auth: {
  //   username: "hello123",
  //   password: "lkdsfhglhgoirw",
  // },
  // timeout: 0,
  timeoutErrorMessage: "超時囉",
  responseType: "text",
  headerMap: true,
  // cache: false,
  // cacheLifetime: 1000 * 60 * 2,
  withCredentials: false,
  validation: true,
  interceptor: {
    // onBeforeValidation() {},
    onValidationFailed(error) {
      foolProof(error?.message);
    },
    // onBeforeBuildingURL() {},
    // onBeforeRequest() {},
    // onRequest() {},
    // onRequestFailed() {},
    onRequestSucceed: (res) => {
      res.transformFromHooks = true;
      res.data = JSON.parse(res.data);
      console.log("get result from onRequestSucceed", res);
      return res;
    },
  },
  // api: [],
};

/**
 * 使用此方法創建 API 抽象層
 */
const userService = createService(service);
console.log(userService);

/**
 * 掛載到全域物件
 * @description 掛載後會以 root service 的 name 重新命名，若沒有配置 root name，預設會是 `$serviceAPI`。
 */
userService.mount(window);

/**
 * 透過 userService 或掛載後的 service 呼叫 api
 */
// userService.products.getAll();
// or
// 設置 root name 為 `storeAPI`
// window.$storeAPI.products.getAll();
// 無 root name
// window.$serviceAPI.products.getAll();
