import { createService } from "../../../../dist/user-service.esm.js";
import postService from "./serviceSlice/postService.js";

/** @type {import("../../../../dist/types/userService.type.js").ServiceConfigRoot} */
const serviceConfig = {
  baseURL: "https://jsonplaceholder.typicode.com",
  name: "jsonPlaceholder",
  children: [postService],
  validation: true,
  onRequestSucceed(res) {
    const response = JSON.parse(res?.data);
    res.data = response;
    console.log(response);
  },
};

const service = createService(serviceConfig);
console.log(service);

service.mount(window);
