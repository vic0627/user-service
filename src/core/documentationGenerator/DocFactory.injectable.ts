import Injectable from "src/decorator/Injectable.decorator";
import { ServiceConfigChild, ServiceConfigRoot } from "src/types/userService.type";
import DocViewObj from "./doc-view-obj";

@Injectable()
export default class DocFactory {
  #serviceConfig?: ServiceConfigRoot | ServiceConfigChild;
  #docViewObj!: DocViewObj;
  #renderData: any;

  setDocFactoryConfigData(serviceConfig: ServiceConfigRoot) {
    this.#serviceConfig = serviceConfig;
    this.#docViewObj = new DocViewObj(serviceConfig);
    this.#renderData = this.#docViewObj.getRenderData();
    // eslint-disable-next-line no-console
    console.log("origin config data", this.#serviceConfig);
    // eslint-disable-next-line no-console
    console.log("view config data", this.#docViewObj);
    // eslint-disable-next-line no-console
    console.log("render data", this.#renderData);

    if (!this.#serviceConfig) {
      throw new Error("no serviceConfig data");
    }
  }
}
