import { createContext } from "react";
import { createService } from "@user-service";
import products from "./slices/products";

export const storeService = createService({
  baseURL: "https://fakestoreapi.com/",
  name: "storeAPI",
  children: [products],
  validation: true,

  // timeout: 20,
  // timeoutErrorMessage: "超時拉基掰",
  // headers: {
  //   fuck: "you",
  //   hello: "world",
  // },
  // auth: {
  //   username: "hello",
  //   password: "asd123sdf"
  // },

  onRequestSucceed(res) {
    if (!res) return;
    res.transformFromHooks = true;
    res.data = JSON.parse(res.data);
    console.log("get result from onRequestSucceed", res);
    return res;
  },
});

export const storeServiceContext = createContext(storeService);
