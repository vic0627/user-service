import Injectable from "src/decorator/Injectable.decorator";
import { ServiceConfigChild, ServiceConfigRoot } from "src/types/userService.type";
import DocViewObj from "./doc-view-obj";

/**
 * @issue
 * 
 * ---
 *
 * 1. Pass the root configuration directly into the document factory:
 * 
 *    This is equivalent to traversing the same tree structure twice.
 *    The time complexity during initialization will double directly.
 *    Have you considered extracting the necessary data from the various methods in the service factory instead?
 *    Additionally, if the parsing logic of the document factory differs from that of the
 *    service factory or other modules, it may lead to inconsistent data.
 * 
 * ---
 * 
 * 2. When extracting data from other modules:
 *  
 *    Consider injecting the doc factory as a dependency into the required module
 *    and create methods on the doc factory to handle the corresponding data.
 * 
 * ---
 * 
 * 3. Function Decomposition, Single Responsibility Principle:
 * 
 *    Strive to maintain the singular functionality of each method (including the constructor).
 *    Each method should perform only one task, enhancing overall code readability and maintainability.
 * 
 * ---
 * 
 * 4. Class Abstraction
 * 
 *    You utilize multiple classes as storage forms for different data,
 *    each having common methods like `.getRenderData()`.
 *    Consider extracting and abstracting these common methods to standardize them,
 *    allowing subsequent modules to directly depend on the abstraction when referenced.
 */
const issue = "hover to read the issue";

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
